function showRecommendation(platform) {
    const recommendationContent = document.getElementById('recommendation-content');
    let content = '';

    if (platform === 'facebook') {
        content = `
            <h3>Facebook Security Tips:</h3>
            <ul>
                <li>Enable two-factor authentication (2FA).</li>
                <li>Review and update your privacy settings.</li>
                <li>Be cautious when accepting friend requests.</li>
                <li>Don't click on suspicious links in messages or posts.</li>
                <li>Log out from public or shared devices after use.</li>
            </ul>
        `;
    } else if (platform === 'instagram') {
        content = `
            <h3>Instagram Security Tips:</h3>
            <ul>
                <li>Enable two-factor authentication (2FA).</li>
                <li>Set your profile to private.</li>
                <li>Monitor third-party app access to your account.</li>
                <li>Avoid sharing sensitive information in posts or DMs.</li>
                <li>Report suspicious accounts and activities.</li>
            </ul>
        `;
    } else if (platform === 'twitter') {
        content = `
            <h3> X Security Tips:</h3>
            <ul>
                <li>Enable two-factor authentication (2FA).</li>
                <li>Review third-party app permissions regularly.</li>
                <li>Be cautious about the personal information you share.</li>
                <li>Use strong, unique passwords for your account.</li>
                <li>Report and block suspicious or abusive accounts.</li>
            </ul>
        `;
    }

    recommendationContent.innerHTML = content;
    recommendationContent.style.display = 'block';
}
