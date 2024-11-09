'use client'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { eq, desc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const InterviewList = () => {
    const [interviews, setInterviews] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            getInterviewList();
        }
    }, [user]);

    const getInterviewList = async () => {
        if (user?.primaryEmailAddress?.emailAddress) {
            const result = await db.select()
                                   .from(MockInterview)
                                   .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
                                   .orderBy(desc(MockInterview.id));
            setInterviews(result);
            console.log("Interviews fetched:", result);
        } else {
            console.log("User email is not available");
        }
    };

    return (
        <div>
            <h2 className='text-xl font-semibold mt-5'>Your AI Mock Interviews</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
            {interviews.map((interview, index) => (
                <div key={index} className='p-5 border rounded-lg my-5 bg-secondary shadow-md'>
                    <h2 className='text-xl font-bold text-blue-700'>{interview.jobPosition}</h2>
                    <h2 className='text-'>{interview.jobExperience} Years of experience</h2>
                    <h2 className='text- '>{interview.createdAt}</h2>
                    <div className='flex justify-between mt-5'>
                    
                    <Link href={'/dashboard/interview/'+interview.mockId+'/feedback'}><Button variant="ghost">Feedback</Button></Link>
                    <Link href={'/dashboard/interview/'+interview.mockId}><Button  className=''>Start</Button></Link>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default InterviewList;
