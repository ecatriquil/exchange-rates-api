/// <reference types="jquery" />

$('#latest').click((e) => {
    hideCalendar();
});

$('#date').click((e) => {
    showCalendar();
    updateCalendar();
});

$('#submit').click((e) => {
    e.preventDefault();
    const { date, base } = setCurrencyAndDate();
    deletePreviousResultTable();
    getExchangeRates(date,base)
    .then(results => {
        createResultTable(results)
    })
    .catch(err => console.error(err));
});


function setCurrencyAndDate() {
    const base = $('#base').val();
    let date;

    if ($("input[type=radio][name=options]:checked" ).val() === 'latest') {
        date = $( "input[type=radio][name=options]:checked" ).val();
    }

    if ($("input[type=radio][name=options]:checked" ).val() === 'date') {
        date = $('#start').val();
    }

    return { date, base }
}

function showCalendar() {
    $('#calendario').removeClass('oculto');
    $('#calendario').addClass('visible');
}

function hideCalendar() {
    $('#calendario').removeClass('visible');
    $('#calendario').addClass('oculto');
}

function showTable() {
    $('#tabla-resultados').removeClass('oculto');
    $('#tabla-resultados').addClass('visible');
}

function loadCurrenciesOptions(){
    getBaseCurrencies()
    .then(results => {
        setCurrenciesOptions(results)
    })
    .catch(err => console.error(err));
}

async function getBaseCurrencies(){
    const response = await fetch('https://api.exchangeratesapi.io/latest');
    const json = await response.json();
    return json;
}

function setCurrenciesOptions(response){
    $('select').append($(`<option value=${response.base}>${response.base}</option>`));
        Object.keys(response.rates).forEach(currency => {
            $('select').append($(`<option value="${currency}">${currency}</option>`));
    });
}

async function getExchangeRates(date, base){
    const response = await fetch(`https://api.exchangeratesapi.io/${date}?base=${base}`) 
    const json = await response.json();
    return json;
}

function createResultTable(response){
    showTable();
    $('h2').text(`Exchange rate from ${response.date} in ${response.base}`);
    Object.keys(response.rates).forEach(moneda => {
        $('tbody').append(`
            <tr class=base>
                <td>${moneda}</td>
                <td>${response.rates[moneda]}</td>
            </tr>
        `);    
    });

}

function deletePreviousResultTable() {
    const $resultados = $( ".base" );
    for (let i = 0; i < $resultados.length; i++) {
        $resultados[i].remove();
    }
}

function updateCalendar(){
    var hoy = new Date();
    var dd = String(hoy.getDate()).padStart(2, '0');
    var mm = String(hoy.getMonth() + 1).padStart(2, '0');
    var yyyy = hoy.getFullYear();
    const fechaCompleta = `${yyyy}-${mm}-${dd}`;
    $('#start').attr('value', fechaCompleta);
    $('#start').attr('max', fechaCompleta);
}

loadCurrenciesOptions();
