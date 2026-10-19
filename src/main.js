import { PREP_TIME } from './js/menu';

const refs = {
  form: document.querySelector('.form'),
  logList: document.querySelector('.order-log'),
};

function makeOrder(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      }

      reject(delay);
    }, delay);
  });
}

function addOrderRow(drink) {
  const item = document.createElement('li');

  item.classList.add('row-pending');
  item.textContent = `⏳ ${drink} · у роботі…`;

  refs.logList.append(item);

  return item;
}

refs.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const drink = formData.get('drink');
  const state = formData.get('state');

  const order = makeOrder(PREP_TIME[drink], state === 'fulfilled');

  const row = addOrderRow(drink);

  order
    .then(delay => {
      row.classList.replace('row-pending', 'row-ok');
      row.textContent = `✅ ${drink} · готове · ${delay} ms`;
    })
    .catch(delay => {
      row.classList.replace('row-pending', 'row-err');
      row.textContent = `❌ ${drink} · скасовано · ${delay} ms`;
    })
    .finally(() => {
      row.textContent += ` · ${new Date().toLocaleTimeString('uk-UA')}`;
    });
}
