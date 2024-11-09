import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

const Questions_Section = ({questions, activeQuestionIndex}) => {

    const textToSpeech = (text) => {
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text)
            speech.lang = 'en-US'
            speech.rate = 0.8
            window.speechSynthesis.speak(speech)
        }else{
            alert('Your browser does not support text to speech')
        }
    }

  return questions && (
    <div className='p-5 rounded-lg border my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-10'>
        {
            questions && questions.map((question, index) => (
                    <h2 key={index} 
                    className={`p-2 text-xs md:text-sm text-center cursor-pointer bg-secondary  
                        rounded-full ${activeQuestionIndex==index? 'bg-blue-600 text-white':''}`}>Question #{index+1}</h2>
            ))
        }
        </div>
        <h2 className='text-sm md:text-lg  my-5'>{questions[activeQuestionIndex] && questions[activeQuestionIndex].question}</h2>
        <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(questions[activeQuestionIndex] && questions[activeQuestionIndex].question)}/>
        <div className='border rounded-lg bg-blue-100 p-5 mt-20'>
            <h2 className='flex gap-2 items-center text-blue-700'>
                <Lightbulb/> <strong>Info</strong>
            </h2>
            <p className='text-sm '>
                You can record your answer by clicking on the record button. At the end of the 
                interview, we will provide you with a feedback and correct answers to the questions.
            </p>
        </div>
    </div>
  )
}

export default Questions_Section