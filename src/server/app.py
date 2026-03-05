from fastapi import FastAPI
from pydantic import BaseModel
import openai

app = FastAPI()


class Submission(BaseModel):
    company: str
    role: str
    project: str
    interviewProcess: str
    advice: str


@app.post("/generate")
def generate(submission: Submission):

    prompt = f"""
Write a short internship story article.

Company: {submission.company}
Role: {submission.role}
Project: {submission.project}
Interview process: {submission.interviewProcess}
Advice: {submission.advice}
"""

    response = openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": prompt}]
    )

    return {"article": response["choices"][0]["message"]["content"]}
