function resetReceipt() {
    // document.querySelector('.receipt-container').style.display = 'none';
    // document.querySelector('.print-id').style.display = 'none';
    // document.querySelector('.print-matches').style.display = 'none';
}

function printId(id) {
    console.log(id);
    resetReceipt();
    // document.querySelector('#id-number').innerHTML = id;
    // document.querySelector('.receipt-container').style.display = 'block';
    // document.querySelector('.print-id').style.display = 'block';

    const escpos = require('escpos');
    // console.log(escpos.USB.findPrinter());
    const device = new escpos.USB();
    // const device  = new escpos.Network('localhost');
    // const device  = new escpos.Serial('3');
    console.log('device: ' + JSON.parse(JSON.stringify(device)));
    const printer = new escpos.Printer(device);

device.open(function(){
  printer
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .text('敏捷的棕色狐狸跳过懒狗')
  .barcode('1234567', 'EAN8')
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.cut();
    this.close();
  });
});
}
printId(32);
function printMatches(matches) {
    console.log('matches' + matches);
    resetReceipt();
    // document.querySelector('.receipt-container').style.display = 'block';
    // document.querySelector('.print-matches').style.display = 'block';
    for (var i = 0; i < matches.length; i++) {
        if (matches[i]) {
            var div = document.createElement('div');
            div.innerHTML = '#' + matches[i];
            //document.querySelector('.print-matches').appendChild(div);
        }
    }
}
