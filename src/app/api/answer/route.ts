import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
      const {questionId, answer, authorId}=await request.json(); // Ensure the request body is parsed  
      const response=await databases.createDocument(db, answerCollection,ID.unique(), {
        questionId:questionId,
        content:answer,
        authorId:authorId
      })
      // increasing reputation
      const prefs=await users.getPrefs<UserPrefs>(authorId)
      await users.updatePrefs(authorId,{
        reputation:Number(prefs.reputation)+1
      })

      return NextResponse.json({
        status:201
      })
    } catch (error:any) {
        return NextResponse.json({
            error: error?.message || "An error occurred creating ans"
        },
    {
        status: error?.status|| error?.code || 500
    }
    )
        
    }
    
}

export async function DELETE(request:NextRequest){
    try {
       const {answerId}= await request.json(); // Ensure the request body is parsed
        const answer= await databases.getDocument(db, answerCollection, answerId);
        const response= await databases.deleteDocument(db, answerCollection, answerId);
           
        
        // decreasing reputation
        const prefs=await users.getPrefs<UserPrefs>(answer.authorId)
        await users.updatePrefs(answer.authorId,{
            reputation: Number(prefs.reputation)-1
        })
        return NextResponse.json({data:response},{
            status:200
        })
       

    } catch (error:any) {
        return NextResponse.json({
            message: error?.message|| "An error occurred deleting answer"
        },
    {
        status: error?.status || error?.code || 500
    }
    )
    }
}