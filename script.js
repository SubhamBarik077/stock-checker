const API_KEY = '1a8e96a1edb04a8b92cda67033c04efc';

async function checkStock() {
  const symbol = document.getElementById('symbol').value.toUpperCase().trim();
  const resultDiv = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('errorDiv');
  const stockDataDiv = document.getElementById('stockData');

  if (!symbol) {
    alert('Enter a stock symbol');
    return;
  }

  resultDiv.classList.add('show');
  loadingDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  stockDataDiv.style.display = 'none';

  try {
    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=220&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.status === 'error' || !data.values) {
      throw new Error(data.message || 'Stock not found');
    }

    const values = data.values;
    const currentPrice = parseFloat(values[0].close);

    // Calculate 200-day MA
    const last200Days = values.slice(0, 200);
    let sum = 0;
    last200Days.forEach(day => {
      sum += parseFloat(day.close);
    });
    const avg200 = sum / last200Days.length;
    const difference = currentPrice - avg200;

    document.getElementById('symbolName').textContent = symbol;
    document.getElementById('price').textContent = '$' + currentPrice.toFixed(2);
    document.getElementById('ma').textContent = '$' + avg200.toFixed(2);
    const percentageDifference = (difference / avg200) * 100;
    document.getElementById('diff').textContent = (percentageDifference > 0 ? '+' : '') + percentageDifference.toFixed(2) + '%';

    loadingDiv.style.display = 'none';
    stockDataDiv.style.display = 'block';

  } catch (error) {
    loadingDiv.style.display = 'none';
    errorDiv.style.display = 'block';
    errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + error.message;
  }
}

// Allow Enter key
document.getElementById('symbol').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkStock();
});