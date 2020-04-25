getData();

async function getData() {
    const response = await fetch('/stoc');
    const resp = await response.json();

    for (item of resp) {
    const master = document.createElement('p');
    const a = document.createElement('div');
    //const b = document.createElement('div');

    a.textContent = `longitude: ${item.long}, latitude:${item.lat}`;

    master.append(a);

    document.body.append(master);
    }
}