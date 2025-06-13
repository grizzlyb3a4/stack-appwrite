import { db } from "../name";
import createAnswerCollection from "./answer.Collection";
import createCommentCollection from "./comment.Collection";
import createQuestionCollection from "./question.Collection";
import createVoteCollection from "./vote.Collection";

import { databases } from "./config";

export default async function getOrCreateDB(){
  try {
    await databases.get(db)
    console.log("Database connection")
  } catch (error) {
    try {
      await databases.create(db, db)
      console.log("database created")
      //create collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),

      ])
      console.log("Collection created")
      console.log("Database connected")
    } catch (error) {
      console.log("Error creating databases or collection", error)
    }
  }

  return databases
}