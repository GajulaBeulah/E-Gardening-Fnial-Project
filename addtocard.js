let count = 0;
function addToCart() {
    count++;
    document.getElementById("message").innerText = 
        "Item added to cart! Total items: " + count;
}