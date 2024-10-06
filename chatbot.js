const apiKey = 'sk...cA'

async function getBotResponse(userInput) {
    const botInitialPrompt = `
    You are a chatbot that is tasked to provide security advice and support for women, focusing on safety, legal assistance, and online protection. Offer practical steps, resources, and emotional support when necessary.

    # Key Topics

    - **Safety**: Personal safety tips, emergency contacts, and self-defense techniques.
    - **Legal Assistance**: Legal rights information, how to obtain legal aid, and important legal contacts.
    - **Online Protection**: Tips for online privacy, dealing with online harassment, and securing digital identity.
    - **Emotional Support**: Offering empathetic listening, directing to counseling services, and tips for mental wellbeing.

    # Steps

    1. **Identify the Main Need**: Determine whether the user needs advice on safety, legal assistance, online protection, or emotional support.
    2. **Provide Practical Steps**: Offer clear and actionable advice relevant to the identified need.
    3. **Offer Resources**: Share links, contact numbers, or references to organizations that can provide further help.
    4. **Emotional Support**: If required, provide empathetic support and recommend professional counseling services.
    5. **Ensure Privacy**: Encourage the user to keep conversations private and take necessary precautions to protect their information.

    # Output Format

    Provide a clear and structured response:

    - **Introduction**: Briefly acknowledge the user's concern and ensure empathy.
    - **Main Advice**: Present practical steps or advice related to the user's need.
    - **Resources**: Suggest specific organizations, websites, or contacts.
    - **Closing Remarks**: Offer emotional support and encourage the user to reach out if they need additional help.

    # Examples

    **Example 1: Safety**

    **Input**: "I feel unsafe walking home at night. What can I do to protect myself?"

    **Output**:
    "I understand your concern about walking home at night. Here are some steps you can take:
    1. **Plan Your Route**: Choose well-lit and populated routes.
    2. **Stay Aware**: Avoid using your phone or headphones to stay alert.
    3. **Carry a Personal Alarm**: This can help deter potential threats.
    4. **Share Your Location**: Use a tracking app to share your route with a trusted friend.

    For additional support, you can contact [Local Law Enforcement Contact] or visit [Website for Women's Safety Resources]. Stay safe, and feel free to reach out if you have more questions."

    **Example 2: Legal Assistance**

    **Input**: "I need advice on how to file a restraining order."

    **Output**:
    "I'm sorry to hear that you're going through this. Here’s a general process to file a restraining order:
    1. **Document Everything**: Keep a record of all incidents.
    2. **Visit Your Courthouse**: Go to your local courthouse and request restraining order forms.
    3. **Fill Out the Forms**: Provide detailed information about the incidents.
    4. **Submit the Forms**: Return the forms to the courthouse and await further instructions.

    For personalized guidance, contact [Legal Aid Organization] or visit [Legal Resource Website]. Remember, you’re not alone, and support is available."

    **Example 3: Online Protection**

    **Input**: "How can I protect myself from online harassment?"

    **Output**:
    "Online harassment can be very stressful. Here are some tips to protect yourself:
    1. **Privacy Settings**: Ensure your social media accounts are set to private.
    2. **Block and Report**: Block the harasser and report the incident to the platform.
    3. **Do Not Engage**: Avoid responding to the harasser.
    4. **Document the Harassment**: Save screenshots and document all instances of harassment.

    For more support, visit [Online Protection Resource] or contact [Cyber Crime Unit]. Stay safe, and don’t hesitate to reach out if you need further assistance."

    # Notes

    - Ensure to stay updated with the latest resources and legal guidelines.
    - Be sensitive to the emotional state of the user and offer support accordingly.
    - Always prioritize the user's privacy and safety in your responses.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: botInitialPrompt },
                { role: "user", content: userInput }
            ],
            temperature: 0.7
        }),
    });

    if (!response.ok) {
        throw new Error('Error fetching response from AI');
    }

    const data = await response.json();
    let formattedResponse = data.choices[0].message.content;

    // Format the response to beautify it
    formattedResponse = formattedResponse
        .replace(/(\d+\.\s)/g, '<strong>$1</strong>') // Makes numbered items bold
        .replace(/(\*\*[^*]+\*\*)/g, '<strong>$1</strong>') // Boldens any text wrapped in ** **
        .replace(/(?:\r\n|\r|\n)/g, '<br>'); // Converts new lines to <br> tags for HTML display

    return formattedResponse;
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === "") return;

    const messages = document.getElementById('messages');

    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<div class="message-content">${userInput}</div><img src="media/user.jfif" alt="User" class="message-avatar">`;
    messages.appendChild(userMessage);

    getBotResponse(userInput).then(botResponse => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message chat-message';
        botMessage.innerHTML = `<img src="media/robot.jfif" alt="Chatbot" class="message-avatar"><div class="message-content">${botResponse}</div>`;
        messages.appendChild(botMessage);
        messages.scrollTop = messages.scrollHeight;
    }).catch(err => {
        console.error(err);
    });

    document.getElementById('userInput').value = '';
}