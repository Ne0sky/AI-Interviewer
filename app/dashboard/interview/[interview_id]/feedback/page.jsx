'use client'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ArrowUpDownIcon, ChevronsLeftRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


function Feedback() {
    const params = useParams();
    const [feedback, setFeedback] = useState([])

    useEffect(() => {
        getFeedback()
    }, [])

    const getFeedback = async () => {
        // Get feedback from the server

        const result = await db.select().
            from(UserAnswer).
            where(eq(UserAnswer.mockIdRef, params.interview_id)).
            orderBy(UserAnswer.id);
        console.log(result)
        setFeedback(result)
    }
    return (
        <div className='p-10'>
            <h2 className='text-3xl font-bold text-lime-500'>Congratulations</h2>
            <h2 className='text-2xl font-bold'>Here is your interview feedback</h2>
            <h2 className='text-blue-500 my-3'>Your overall interview rating: <strong>7/10</strong></h2>

            <h2 className='text-sm text-zinc-700'>Find interview questions with correct answers, Your answer and feedback for improvement</h2>
            {
                feedback && feedback.map((item, index) => (
                    <Collapsible key={index} className='mt-7'>
                        <CollapsibleTrigger className='p-2 flex justify-between w-full bg-secondary rounded-lg my-2 text-left'>
                        {item.question}
                        <ChevronsLeftRightIcon className='rotate-90 h-5 w-5'/>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className='flex flex-col gap-5'>
                                <h2 className='p-2 border rounded-lg text-blue-500'>
                                    <strong>Rating:</strong>
                                    {item.rating}
                                </h2>
                                <h2 className='p-2 border rounded-lg text-red-500 bg-red-50'>
                                    <strong>Your Answer:</strong>
                                    {item.userAns}
                                </h2>
                                
                                <h2 className='p-2 border rounded-lg text-green-500 bg-green-50'>
                                    <strong>Correct Answer:</strong>
                                    {item.correctAns}
                                </h2>
                                <h2 className='p-2 border rounded-lg text-blue-500 bg-blue-50'>
                                    <strong>Feedback:</strong>
                                    {item.feedback}
                                </h2>
                                </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))
            }
            <Link href={'/dashboard'}><Button className='my-7'>Go Home</Button></Link>
        </div>
    )
}

export default Feedback