class AppointementsDto {
  constructor(id_car, id_user, id_services, date_appointement) {
    this.id_car = id_car;
    this.id_user = id_user;
    this.id_services = Array.isArray(id_services) ? id_services : [id_services];
    this.date_appointement = date_appointement;
  }
}

