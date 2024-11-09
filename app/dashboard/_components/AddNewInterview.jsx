'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/gemini_ai'
import { LoaderCircleIcon } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/utils/db'
import moment from 'moment/moment'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/compat/router'



const AddNewInterview = () => {
    const[open, setOpen] = useState(false)
    const [jobRole, setJobRole] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [yearsOfExperience, setYearsOfExperience] = useState('')
    const [loading, setLoading] = useState(false)
    const [jsonRespone, setJsonResponse] = useState([])
    const router = useRouter()

    const {user} = useUser()

    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        const InputPromt = `job position:`+jobRole +`, job description:`+jobDescription+`, years of exp:`+yearsOfExperience+` depending this give 5 interview
questions and answers as filled in json. Do not anything extra, just a json format response is needed `
        console.log(jobRole, jobDescription, yearsOfExperience)
        const result = await chatSession.sendMessage(InputPromt)
        const mockjsonresp = (result.response.text()).replace('```json','').replace('```','')
        if(mockjsonresp){
        console.log(JSON.parse(mockjsonresp))
        setJsonResponse(JSON.parse(mockjsonresp))

        const resp = await db.insert(MockInterview).values({
            mockId: uuidv4(),
            jsonMockresp: mockjsonresp,
            jobPosition: jobRole,
            jobDesc: jobDescription,
            jobExperience: yearsOfExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('YYYY-MM-DD')
        }).returning({mockId: MockInterview.mockId})

        console.log('Inseted Id',resp)
    } else{
        console.log('No response from Gemini')
    }
    setLoading(false)
    if(resp){
        setOpen(false)
        router.push('/dashboard/interview'+resp[0]?.mockId)
    }
    }
    return (
        <div>
            <div onClick={()=>setOpen(true)} className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-lg cursor-pointer transition-all'>
                <h2  className='font-bold text-lg text-center'>+ Add</h2>
            </div>
            <Dialog open={open}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                           <div>
                            <h2>Add details about your job/position, job description ans years of experience</h2>
                            <div className='mt-7 my-3'>
                                <label>Job Role/Job Position</label>
                                <Input placeholder='eg. Full stack developer' required
                                onChange={(e)=>setJobRole(e.target.value)}
                                />
                            </div>
                            <div className='my-3'>
                                <label>Job Description/Tech stack</label>
                                <Textarea placeholder='eg. React js, Angular, postgres' required
                                onChange={(e)=>setJobDescription(e.target.value)}
                                />
                            </div>
                            <div className=' my-3'>
                                <label>Years of Experience</label>
                                <Input type='numbers' placeholder='5' required
                                onChange={(e)=>setYearsOfExperience(e.target.value)}
                                />
                            </div>
                            </div>
                            <div className='flex gap-5 justify-end'>
                                <Button type="button" variant="ghost" onClick={()=>setOpen(false)}>Close</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading? <><LoaderCircleIcon className='animate-spin' size={24}/> Generating from Gemini</>: 'Start Interview'}
                                </Button>
                            </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddNewInterview