import axios from 'axios';

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;

const headers = {
  "Authorization": "Bearer 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",
  "Accept": stream ? "text/event-stream" : "application/json"
};

const payload = {
  "model": "minimaxai/minimax-m3",
  "messages": [{"role":"user","content":""}],
  "max_tokens": 8192,
  "temperature": 1.00,
  "top_p": 0.95,
  "stream": stream,
  
  
  
};

// MiniMax-M3 is multimodal. To send images or video, set a message's
// "content" to an array of parts (a public URL or a base64 data URI):
//   messages: [{ role: "user", content: [
//       { type: "text", text: "Describe this." },
//       { type: "image_url", image_url: { url: "https://example.com/image.jpg" } },
//       { type: "video_url", video_url: { url: "https://example.com/video.mp4" } },
//   ]}]

axios.post(invokeUrl, payload, { headers: headers, responseType: stream ? 'stream' : 'json' })
  .then(response => {
    if (stream) {
      response.data.on('data', (chunk) => {
        console.log(chunk.toString());
      });
    } else {
      console.log(JSON.stringify(response.data));
    }
  })
  .catch(error => {
    if (error.response) {
      console.error(`HTTP ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(error);
    }
  });