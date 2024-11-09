'use client'
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useParams } from 'next/navigation';
import { eq } from 'drizzle-orm';
import Questions_Section from './_components/Questions_Section';
import RecordAnswer from './_components/RecordAnswer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = () => {
    const [interviewDetails, setInterviewDetails] = useState();
    const params = useParams();
    const [questions, setQuestions] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        GetInterviewDetails();
    }, []);
    
    const GetInterviewDetails = async () => {
        const interviewId = params.interview_id;
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
        setInterviewDetails(result[0]);
        
        const questions = JSON.parse(result[0].jsonMockresp);
        setQuestions(questions);

        // Log interview details after fetching them
        console.log("Fetched interview details:", result[0]);
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
                <Questions_Section 
                    questions={questions}
                    activeQuestionIndex={activeQuestionIndex}
                />

                <RecordAnswer
                    questions={questions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewDetails={interviewDetails}
                />
               
            </div>
            <div className='flex justify-end gap-5 my-10'>
            {activeQuestionIndex > 0 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
            {activeQuestionIndex === questions.length-1 ? <Link href={'/dashboard/interview/'+interviewDetails.mockId+'/feedback'}><Button>Submit Interview</Button></Link> : <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
            </div>
            
        </div>
    );
};

export default StartInterview;
