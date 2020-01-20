/// <reference types="jquery" />

$('#latest').click((e) => {
    ocultarCalendario();
});

$('#date').click((e) => {
    mostrarCalendario();
    actualizarCalendario();
});

$('#submit').click((e) => {
    e.preventDefault();
    const { date, base } = definirBaseDate();
    borrarResultadosAnteriores();
    traerExchangeRates(date, base);
});

function definirBaseDate() {
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

function mostrarCalendario() {
    $('#calendario').removeClass('oculto');
    $('#calendario').addClass('visible');
}

function ocultarCalendario() {
    $('#calendario').removeClass('visible');
    $('#calendario').addClass('oculto');
}

function mostrarTabla() {
    $('#tabla-resultados').removeClass('oculto');
    $('#tabla-resultados').addClass('visible');
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
    const $resultados = $( ".base" );
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
    $('#start').attr('value', fechaCompleta);
    $('#start').attr('max', fechaCompleta);
}

cargarOpcionesBase();
