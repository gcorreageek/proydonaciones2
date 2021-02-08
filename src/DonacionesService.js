
export class DonacionesService {
    constructor(contract) {
        this.contract = contract;
    }

    async crearProyecto(nombre, descripcion,
        total, minimoDonacion, fechaCreacion, 
        fechaInicio, fechaFin, from) {
        return this.contract.crearProyecto(nombre,descripcion,total,
            minimoDonacion,fechaInicio, fechaFin, { from });
    }
    async getProyectos() {
        let total = await this.getTotalProyectos();
        let proyectos = [];
        console.log('total:'+total);
        for (var i = 1; i < total+1; i++) {
            console.log('===p:'+i);
            let proy = await (this.contract.obtenerProyecto(i));
            console.log(proy);
            let donac = [];
            if(proy[10].toNumber()===0){
                donac = [];
            }else{
                for (var e= 1; e< proy[10].toNumber()+1; e++) {
                    let donacarray = await (this.contract.obtenerDonacion(proy[0].toNumber(),e));
                    console.log(donacarray[2]);
                    let donacmap = {
                        idDonacion: donacarray[0].toNumber(),
                        user: donacarray[1],
                        nickName: donacarray[2],
                        deseoConfirmenConPost: donacarray[3],
                        donacion: donacarray[4].toNumber(),
                        transfirio: donacarray[5],
                    };
                    donac.push(donacmap);
                }
            }
            proy[12] = donac;

            let pos = [];
            if(proy[11].toNumber()===0){
                pos = [];
            }else{
                for (var e= 1; e< proy[11].toNumber()+1; e++) {
                    let postarray = await (this.contract.obtenerPost(proy[0].toNumber(),e));
                    console.log(postarray);
                    let posttmap = {
                        idPost: postarray[0].toNumber(),
                        url: postarray[1],
                    };
                    pos.push(posttmap);
                }
            }
            proy[13] = pos;

            proyectos.push(proy);
        }
        console.log(proyectos);
        return this.mapProyectos(proyectos);
    }
    mapProyectos(proyectos) {
        return proyectos.map(proy => {
            return {
                idProyecto: proy[0].toNumber(),
                user: proy[1],
                nombre: proy[2],
                descripcion: proy[3],
                total: proy[4].toNumber(),
                acumulado: proy[5].toNumber(),
                minimoDonacion: proy[6].toNumber(),
                fechaInicio: proy[7].toNumber(),
                fechaFin: proy[8].toNumber(),
                finalizo: proy[9],
                numDonacion: proy[10].toNumber(),
                numPost: proy[11].toNumber(),
                donaciones: proy[12],
                posts: proy[13],
            }
        });
    }
    async getTotalProyectos() {
        let nn =  await (this.contract.totalProyectos());
        console.log(nn);
        return (nn).toNumber();
    }
    async donar(idProyecto,nickName,deseoConfirmenConPost,from,value) {
        return this.contract.donar(idProyecto,nickName,deseoConfirmenConPost, { from , value});
    }
    async postear(idProyecto,url,from) {
        return this.contract.postear(idProyecto,url, { from });
    }
    async transferir(idProyecto,idDonacion,from) {
        return this.contract.transferir(idProyecto,idDonacion, { from });
    }
    async finalizarProyecto(idProyecto,from) {
        return this.contract.finalizarProyecto(idProyecto, { from });
    }
}