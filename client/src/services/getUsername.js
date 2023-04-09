export default async function getUsername(username) {
    const response = await fetch(
        `http://localhost:3001/api/v1/accounts/${username}`
    );
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    return null;
}