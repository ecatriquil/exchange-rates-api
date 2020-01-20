/// <reference types="jquery" />

document.querySelector('#latest').onclick = (e) => {
    ocultarCalendario();
}

document.querySelector('#date').onclick = (e) => {
    mostrarCalendario();
    actualizarCalendario();
}

document.querySelector('#submit').onclick = ((e) => {
    e.preventDefault();
    const { date, base } = definirBaseDate();
    borrarResultadosAnteriores();
    traerExchangeRates(date, base);
});

function definirBaseDate() {
    const $base = document.querySelector('#base');
    const base = $base.value;
    let date;
    if (document.querySelector('#exchange-reference').options.value === 'latest') {
        date = document.querySelector('#exchange-reference').options.value
    }
    if (document.querySelector('#exchange-reference').options.value === 'date') {
        date = document.querySelector('#start').value;
    }

    return { date, base }
}

function mostrarCalendario() {
    const $calendario = document.querySelector('#calendario');
    $calendario.classList.replace('oculto', 'visible');
}

function ocultarCalendario() {
    const $calendario = document.querySelector('#calendario');
    $calendario.classList.replace('visible', 'oculto');
}

function mostrarTabla() {
    const $tablaResultados = document.querySelector('#tabla-resultados');
    $tablaResultados.classList.replace('oculto', 'visible');
}

function traerExchangeRates(date, base) {
    fetch(`https://api.exchangeratesapi.io/${date}?base=${base}`)
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            mostrarTabla();
            $('h2').text(`Exchange rate from ${respuesta.date} in ${respuesta.base}`);
            Object.keys(respuesta.rates).forEach(moneda => {
                $('tbody').append(`
                    <tr class=base>
                        <td>${moneda}</td>
                        <td>${respuesta.rates[moneda]}</td>
                    </tr>
                `);    
            });
        })
        .catch(error => console.error('FALLO', error));
}

function cargarOpcionesBase() {
    fetch(`https://api.exchangeratesapi.io/latest`)
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            $('select').append($(`<option value=${respuesta.base}>${respuesta.base}</option>`));
            Object.keys(respuesta.rates).forEach(moneda => {
                $('select').append($(`<option value="${moneda}">${moneda}</option>`));
            });
        })
        .catch(error => console.error('FALLO', error));
}

function borrarResultadosAnteriores() {
    const $resultados = document.querySelectorAll('.base');
    for (let i = 0; i < $resultados.length; i++) {
        $resultados[i].remove();
    }
}

function actualizarCalendario(){
    var hoy = new Date();
    var dd = String(hoy.getDate()).padStart(2, '0');
    var mm = String(hoy.getMonth() + 1).padStart(2, '0');
    var yyyy = hoy.getFullYear();
    const fechaCompleta = `${yyyy}-${mm}-${dd}`;
    let $inputCalendario = document.querySelector('#start');
    $inputCalendario.value = fechaCompleta; 
    $inputCalendario.max = fechaCompleta;    
}

cargarOpcionesBase();
