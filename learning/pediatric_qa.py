import anthropic
import json
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic()

def ask_pediatric_question(question: str, child_age: str) -> dict:
    """Ask a pediatric question and get a structured answer."""
    
    prompt = f"""
    A parent is asking about their {child_age} old child.
    Question: {question}
    
    Respond ONLY in this exact JSON format, nothing else:
    {{
        "answer": "clear, simple answer a parent can understand",
        "age_relevance": "how this advice is specific to a {child_age} old",
        "when_to_call_doctor": "specific warning signs that need immediate attention",
        "safe_at_home": true or false,
        "source": "AAP guidelines"
    }}
    """
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
        system="You are a pediatric health assistant. You answer based on AAP (American Academy of Pediatrics) guidelines only. Always respond in valid JSON. Never make up information."
    )
    
    # Extract the text response
    raw = response.content[0].text

    # Strip markdown code blocks if present
    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
    clean = clean.strip()

    # Parse it into a Python dictionary
    result = json.loads(clean)
    return result


def display_answer(result: dict) -> None:
    """Print the answer in a readable way."""
    print("\n" + "="*50)
    print(f"📋 ANSWER: {result['answer']}")
    print(f"\n👶 FOR YOUR AGE GROUP: {result['age_relevance']}")
    print(f"\n🚨 CALL DOCTOR IF: {result['when_to_call_doctor']}")
    print(f"\n🏠 Safe to manage at home: {'Yes' if result['safe_at_home'] else 'No — seek care'}")
    print(f"\n📚 Source: {result['source']}")
    print("="*50 + "\n")


if __name__ == "__main__":
    child_age = input("Your child's age (e.g. '2 years'): ")
    question = input("Your question: ")
    
    print("\nLooking up AAP guidelines...")
    result = ask_pediatric_question(question, child_age)
    display_answer(result)