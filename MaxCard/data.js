
export function getLocationCards(userId) {
    const xhr = new XMLHttpRequest();
    let url = "http://44.220.169.6:5000/get_all_cards?user_id=";
    url.concat(userId);
    xhr.open("GET", url);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        const data = xhr.response;
        console.log(data);
        return data;
    } else {
        console.log(`Error: ${xhr.status}`);
    }
    };
}