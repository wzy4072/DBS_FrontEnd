import request from '@/utils/request'

export function addBuilding(data) {
  return request({
    url: '/building/add',
    method: 'post',
    data
  })
}
export function getBuildings() {
  return request({
    url: '/building/list',
    method: 'get'
  })
}

export function getRoomsByBuildingId(id) {
  return request({
    url: '/building/roomList/' + id,
    method: 'get'
  })
}

export function addPhase(data) {
  return request({
    url: '/phase/add',
    method: 'post',
    data
  })
}
