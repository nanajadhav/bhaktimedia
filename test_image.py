from openai import OpenAI
import base64

client = OpenAI()

result = client.images.generate(
    model="gpt-image-2",
    prompt="A beautiful traditional Indian Ganesh Chaturthi festival poster, Lord Ganesha, marigold flowers, diyas, warm golden lighting, premium devotional design",
    quality="low",
    size="1024x1024"
)

image_data = base64.b64decode(result.data[0].b64_json)

with open("test_poster.png", "wb") as f:
    f.write(image_data)

print("✅ Image generated successfully!")
print("📁 Saved as: test_poster.png")