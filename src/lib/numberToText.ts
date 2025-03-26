export const readGroup = (group: string): string => {
  const readDigit: string[] = [
    ' Không',
    ' Một',
    ' Hai',
    ' Ba',
    ' Bốn',
    ' Năm',
    ' Sáu',
    ' Bảy',
    ' Tám',
    ' Chín',
  ];
  let temp = '';
  if (group === '000') return '';
  temp = readDigit[parseInt(group.substring(0, 1))] + ' Trăm';
  if (group.substring(1, 2) === '0') {
    if (group.substring(2, 3) === '0') return temp;
    else {
      temp += ' Lẻ' + readDigit[parseInt(group.substring(2, 3))];
      return temp;
    }
  } else temp += readDigit[parseInt(group.substring(1, 2))] + ' Mươi';
  if (group.substring(2, 3) === '5') temp += ' Lăm';
  else if (group.substring(2, 3) !== '0') temp += readDigit[parseInt(group.substring(2, 3))];
  return temp;
};

export const readNumberToText = (num: string | null | undefined, unit?: string): string => {
  if (num == null || num === '') return '';
  let temp = '';
  const numTem = Number(num);
  let numNegative = '';
  if (numTem < 0) {
    numNegative = 'Âm ';
  }
  num = String(Math.abs(numTem)).padStart(18, '0');
  const g1 = num.substring(0, 3);
  const g2 = num.substring(3, 6);
  const g3 = num.substring(6, 9);
  const g4 = num.substring(9, 12);
  const g5 = num.substring(12, 15);
  const g6 = num.substring(15, 18);
  if (g1 !== '000') {
    temp = readGroup(g1);
    temp += ' Triệu';
  }
  if (g2 !== '000') {
    temp += readGroup(g2);
    temp += ' Nghìn';
  }
  if (g3 !== '000') {
    temp += readGroup(g3);
    temp += ' Tỷ';
  } else if (temp !== '') {
    temp += ' Tỷ';
  }
  if (g4 !== '000') {
    temp += readGroup(g4);
    temp += ' Triệu';
  }
  if (g5 !== '000') {
    temp += readGroup(g5);
    temp += ' Nghìn';
  }
  temp = temp + readGroup(g6);
  temp = temp.split('Một Mươi').join('Mười');
  temp = temp.trim();
  temp = temp.split('Không Trăm').join('');
  temp = temp.trim();
  temp = temp.split('Mười Không').join('Mười');
  temp = temp.trim();
  temp = temp.split('Mươi Không').join('Mươi');
  temp = temp.trim();
  if (temp.indexOf('Lẻ') === 0) temp = temp.substring(2);
  temp = temp.trim();
  temp = temp.split('Mươi Một').join('Mươi Mốt');
  temp = numNegative + temp.trim();
  const result = temp.substring(0, 1).toUpperCase() + temp.substring(1).toLowerCase();
  return (result === '' ? 'Không' : result) + ` ${unit}`;
};
