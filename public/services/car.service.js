
import { httpService } from './http.service.js'
import { getRandomIntInclusive } from './util.service.js'



export const stationService = {
    query,
    getById,
    save,
    remove,
    getEmptyStation,
    addStationMsg
}
window.cs = stationService


async function query(filterBy = { txt: '', price: 0 }) {
    return httpService.get('station', filterBy)
}
function getById(carId) {
    return httpService.get(`station/${carId}`)
}

async function remove(carId) {
    return httpService.delete(`station/${carId}`)
}
async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(`station/${station._id}`, station)

    } else {
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}

async function addStationMsg(carId, txt) {
    const savedMsg = await httpService.post(`station/${carId}/msg`, {txt})
    return savedMsg
}


function getEmptyStation() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: getRandomIntInclusive(1000, 9000),
    }
}





