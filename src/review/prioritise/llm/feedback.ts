import AIModel, { type IFeedback } from "../../../common/model/AIModel"
import { logger } from "../../../common/utils/logger"
import { maxFeedbackCount } from "../../constants"
import PriorityQueue from "./utils/PriorityQueue"

export const processFeedbacks = async (model: AIModel, prompts: string[]): Promise<IFeedback[]> => {
  const feedbacks = await Promise.all(
    prompts.map(async prompt => {
      try {
        return await model.getFeedback(prompt)
      } catch (error) {
        logger.error(`Error in processing prompt`, error)

        return []
      }
    })
  ).then(results => results.flat())

  const worstFeedbacks = pickWorstFeedbacks(feedbacks, maxFeedbackCount)

  return worstFeedbacks.length > 0 ?
      worstFeedbacks
    : [
        {
          fileName: "All files",
          details: "LGTM 🚀",
          riskScore: 0
        }
      ]
}

const pickWorstFeedbacks = (feedbacks: IFeedback[], limit: number): IFeedback[] => {
  const queue = new PriorityQueue<IFeedback>()

  feedbacks
    .filter(feedback => feedback.riskScore > 1)
    .forEach(feedback => {
      queue.enqueue(feedback, feedback.riskScore + Math.random())
      if (queue.size() > limit) {
        queue.dequeue()
      }
    })

  return queue.getItems()
}
