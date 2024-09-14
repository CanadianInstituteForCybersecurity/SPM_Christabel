// Recursive function to add the first n numbers
function sumNumbers(n) {
    if (n === 1) {
        return 1;  // Base case
    } else {
        return n + sumNumbers(n - 1);  // Recursive call
    }
}

// Call the function with 20
let result = sumNumbers(20);
console.log("The sum of the first 20 numbers is: " + result);
