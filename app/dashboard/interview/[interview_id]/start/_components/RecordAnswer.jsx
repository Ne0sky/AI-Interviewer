'use client'
import { Button } from '@/components/ui/button'
import { Mic, Save, StopCircle, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner'
import { chatSession } from '@/utils/gemini_ai'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import moment from 'moment/moment'
import { useUser } from '@clerk/nextjs'

const RecordAnswer = ({questions, activeQuestionIndex, interviewDetails}) => {

  const[userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const {user} = useUser()
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });


  useEffect(() =>{
    results.map((result) => (
      setUserAnswer(prev=> prev + result?.transcript)
    ))
  }, [results])

  useEffect(() => {
    if(!isRecording && userAnswer.length>10){
      SaveUserAnswer()
    }else {
      setUserAnswer('')
    }
  }, [userAnswer])

  const StartStopRecording = async () => {
    if(isRecording){
      stopSpeechToText()
      console.log(interviewDetails)
    }else{
      startSpeechToText()
    }
  }

  const SaveUserAnswer = async () => {
    console.log(userAnswer)
    setLoading(true)
    const feedbackPrompt = `Question:` + questions[activeQuestionIndex].question + `, User_Answer:` +
    userAnswer + `depend on user answer and given interview question, please give rating on answer between 0 and 5
    and feedback on improvement if any in 3 lines. Give response in JSON format with rating field and feedback field`

    const result = await chatSession.sendMessage(feedbackPrompt)
     const feedback = (result.response.text()).replace('```json','').replace('```','')
     console.log(JSON.parse(feedback))
     const feedbackJson = JSON.parse(feedback)

     console.log(interviewDetails?.mockId)

     const resp = await db.insert(UserAnswer).values({
         mockIdRef: interviewDetails?.mockId,
         question: questions[activeQuestionIndex]?.question,
         correctAns: questions[activeQuestionIndex]?.answer,
         userAns: userAnswer,
         rating: feedbackJson?.rating,
         feedback: feedbackJson?.feedback,
         userEmail: user?.primaryEmailAddress?.emailAddress,
         createdAt: moment().format('YYYY-MM-DD')
     })

     if(resp){
         toast.success('Answer saved successfully')
         setResults([])
     }else{
         toast.error('Error in saving answer')
         setResults([])
     }

     setLoading(false)
     setUserAnswer('')
  }

    

    
  return (
    <div className='flex flex-col justify-center items-center '>
        <div className='mt-10 flex items-center justify-center flex-col bg-secondary w-full  h-full rounded-lg border'>
        <WebcamIcon width={200} height={200} className='absolute'/>
        <Webcam
        mirrored={true}
        style={{
            width: '90%',
            height: '90%',
            zIndex:10,
            borderRadius: '10px',
        }}
        />
        </div>
        <div className='mt-10 '>
            <Button 
            disabled={loading}
            onClick={StartStopRecording}
            variant='outline' className='mt-5'>
              {isRecording ? <h2 className='text-red-500 flex gap-2 justify-center items-center'><StopCircle/> Recording</h2> : <h2>Record Answer</h2>}
            </Button>
        </div>
       
    </div>
  )
}

export default RecordAnswer