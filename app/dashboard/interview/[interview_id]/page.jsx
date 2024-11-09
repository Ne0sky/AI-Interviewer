'use client'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const interview = () => {
    const [interviewDetails, setInterviewDetails] = useState([])
    const [webcamEnabled, setWebcamEnabled] = useState(false)
   const params = useParams()
   useEffect(() => {
     GetInterviewDetails()
    }, [])

    const GetInterviewDetails= async()=>{
        const interviewId = params.interview_id
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId))
        console.log(result)
        setInterviewDetails(result[0])
    }
  return (
    <div className='my-10 flex justify-center flex-col items-center'> 
        <h2 className='text-2xl font-bold'>Lets get started</h2>
        <div className='grid grid-cols1 lg:grid-cols-2 gap-10'>
       
        <div className='flex flex-col my-5 gap-5 '>
            <div className='flex flex-col my-5 gap-5 p-5 border bg-secondary rounded-lg'>
            <h2 className='text-lg'><strong>Job Role :</strong> {interviewDetails.jobPosition}</h2>
            <h2 className='text-lg'><strong>Job Description :</strong> {interviewDetails.jobDesc}</h2>
            <h2 className='text-lg'><strong>Years of Experience : </strong>{interviewDetails.jobExperience}</h2>
            </div>
            <div className='bg-yellow-100 p-5 rounded-lg border border-yellow-600'>
                <h2 className='text-yellow-600 flex gap-2 items-center'><Lightbulb /><strong>Information</strong></h2>
                <p className='mt-3 text-yellow-600'>To start your interview, please enable your camera and microphone so your interviewer can see and hear you clearly. Ensure you have a stable internet connection for a smooth experience. When you are ready, click Start Interview. Good luck!</p>
            </div>
        </div>
        <div>
            {
                webcamEnabled ? <Webcam
                onUserMedia={() => setWebcamEnabled(true)}
                onUserMediaError={() => setWebcamEnabled(false)}
                mirrored={true}
                style={{
                    height: 400,
                    width: 400,
                    borderRadius: 10
                }}
                /> :<>
            
            <WebcamIcon className='p-10 bg-secondary h-72 w-full rounded-lg my-7' size='20' />
            <Button className='w-full' variant='ghost' onClick={()=>setWebcamEnabled(true)}>Enable camera and mic</Button>
            </>
}

        </div>
        
        </div>
        <div className='flex justify-end items-end'>
            <Link href={'/dashboard/interview/'+params.interview_id+'/start'}>
        <Button>Start Interview</Button>
        </Link>
        </div>
    </div>
  )
}

export default interview