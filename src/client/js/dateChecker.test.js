 const { dateChecker } = require('./dateChecker');

 test('checks invalid date', () => {
     expect(dateChecker('25 may 2021')).toBe(false);
 });

 test('checks invalid date - month', () => {
     expect(dateChecker('2020-13-15')).toBe(false);
 });


 test('checks valid date ', () => {
     expect(dateChecker('2020-12-15')).toBe(true);
 });