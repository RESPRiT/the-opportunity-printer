function resetReceipt() {
    document.querySelector('.receipt-container').style.display = 'none';
    document.querySelector('.print-id').style.display = 'none';
    document.querySelector('.print-matches').style.display = 'none';
}

function printId(id) {
    console.log(id);
    resetReceipt();
    document.querySelector('#id-number').innerHTML = id;
    document.querySelector('.receipt-container').style.display = 'block';
    document.querySelector('.print-id').style.display = 'block';
}

function printMatches(matches) { 
    console.log('matches' + matches);
    resetReceipt();
    document.querySelector('.receipt-container').style.display = 'block';
    document.querySelector('.print-matches').style.display = 'block';
    for (var i = 0; i < matches.length; i++) {
        if(matches[i]) {
            var div = document.createElement('div');
            div.innerHTML = '#' + matches[i];
            document.querySelector('.print-matches').appendChild(div);
        }
    }
}