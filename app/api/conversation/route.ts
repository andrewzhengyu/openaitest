import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai'


const openai = new OpenAI();

export async function POST(
    req:Request
){
    try {
        const { userId } = auth();
        const content = await req.json();
        
        
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!content) {
            return new NextResponse("Message required", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:content
        })
        console.log(response.choices[0])
        return NextResponse.json(response.choices[0].message);
    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}