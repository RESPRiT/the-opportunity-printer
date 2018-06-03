function printId(id) {
    console.log(id);
    document.querySelector('#id-number').innerHTML = id;
    document.querySelector('.receipt-container').style.display = 'block';
    document.querySelector('.print-id').style.display = 'block';
}

function printMatches(matches) { }

function resetReceipt() { }