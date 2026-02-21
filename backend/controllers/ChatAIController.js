import ollama from 'ollama'


export const chatController = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await ollama.chat({
      model: "llama3:8b",
      messages: [
        {
          role: "system",
          content: "You are a strict AI interviewer  Respond **only in 2 line **. "
        }
        ,
        {
          role: "user",
          content: `Answer the following question  ${message}`
        }
      ]
    });
    let jsonReply;
    try {
      // Remove anything before/after the first '{' ... last '}'
    //   const jsonString = response.message.content
    //     .substring(response.message.content.indexOf("{"), response.message.content.lastIndexOf("}") + 1);

    //   jsonReply = JSON.parse(jsonString);
    // } catch (err) {
    //   // fallback: return raw text
    //   jsonReply = { error: "Model output not valid JSON", raw: response.message.content };
    // }
    res.status(200).json({success:true ,data:response.message.content});

  } catch (err) {
    res.status(500).json({success:false, error: err.message })
  }

}catch(error){
  console.log(error)
   res.status(500).json({success:false, error: err.message })
}
}