function resetReceipt() {
    document.querySelector('.receipt-container').style.display = 'none';
    document.querySelector('.print-id').style.display = 'none';
    document.querySelector('.print-matches').style.display = 'none';
}

function printId(id) {
    console.log(id);
    resetReceipt();
    // document.querySelector('#id-number').innerHTML = id;
    // document.querySelector('.receipt-container').style.display = 'block';
    // document.querySelector('.print-id').style.display = 'block';

    const escpos = require('escpos');

    const device = new escpos.USB();
    // const device  = new escpos.Network('localhost');
    // const device  = new escpos.Serial('/dev/usb/lp0');

    const printer = new escpos.Printer(device);

    device.open(function () {
        printer
            .font('a')
            .align('ct')
            .style('bu')
            .size(1, 1)
            .text('The quick brown fox jumps over the lazy dog')
            .text('敏捷的棕色狐狸跳过懒狗')
            .barcode('12345678', 'EAN8')
            .qrimage('https://github.com/song940/node-escpos', function (err) {
                this.cut();
                this.close();
            });
    });
}

function printMatches(matches) {
    console.log('matches' + matches);
    resetReceipt();
    document.querySelector('.receipt-container').style.display = 'block';
    document.querySelector('.print-matches').style.display = 'block';
    for (var i = 0; i < matches.length; i++) {
        if (matches[i]) {
            var div = document.createElement('div');
            div.innerHTML = '#' + matches[i];
            document.querySelector('.print-matches').appendChild(div);
        }
    }
}
