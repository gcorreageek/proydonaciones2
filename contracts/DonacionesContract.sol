pragma solidity >=0.4.0 <0.6.0;

contract DonacionesContract {
    struct Donacion {
        address user;
        string nickName;
        bool deseoConfirmenConPost;
        uint256 donacion;
        bool transfirio;
    }
    struct Post {
        string url;
    }
    struct Proyecto {
        address payable user;
        string nombre;
        string descripcion;
        uint256 total;
        uint256 acumulado;
        uint256 minimoDonacion;
        uint256 fechaInicio;
        uint256 fechaFin;
        bool finalizo;
        uint256 numDonacion;
        uint256 numPost;
        mapping(uint256 => Donacion) donacionesMap;
        mapping(uint256 => Post) postMap;
    }
    uint256 numProyecto = 0;
    mapping(uint256 => Proyecto) proyectosMap;

    constructor() public {}

    function crearProyecto( string memory nombre, string memory descripcion,
        uint256 total, uint256 minimoDonacion, uint256 fechaInicio, uint256 fechaFin ) public {
        numProyecto++;
        proyectosMap[numProyecto] = Proyecto({ user:msg.sender, nombre:nombre, descripcion:descripcion, total:total,acumulado:0,
                minimoDonacion:minimoDonacion,fechaInicio:fechaInicio, fechaFin:fechaFin,finalizo:false, numDonacion:0, numPost:0
        });
    }

    function donar( uint256 idProyecto, string memory nickName, bool deseoConfirmenConPost ) public payable returns (uint256 id) {
        Proyecto storage p = proyectosMap[idProyecto];
        require(msg.value >= p.minimoDonacion);
        Donacion memory donacion;
        if (deseoConfirmenConPost) {
            donacion = Donacion({
                user: msg.sender,
                nickName: nickName,
                deseoConfirmenConPost: deseoConfirmenConPost,
                donacion: msg.value,
                transfirio: false
            });
        } else {
            p.user.transfer(msg.value);
            donacion = Donacion({
                user: msg.sender,
                nickName: nickName,
                deseoConfirmenConPost: deseoConfirmenConPost,
                donacion: msg.value,
                transfirio: true
            });
            p.acumulado = p.acumulado + donacion.donacion;
        }
        p.numDonacion++;
        p.donacionesMap[p.numDonacion] = donacion;
        return p.numDonacion;
    }
    function totalProyectos() public view returns (uint256) {
        return numProyecto;
    }
    function obtenerProyecto(uint256 id) public view returns (
        uint256 idProyecto,address user, string memory nombre, string memory descripcion, uint256 total,uint256 acumulado,
        uint256 minimoDonacion,uint256 fechaInicio,uint256 fechaFin,bool finalizo,uint256 numDonacion,uint256 numPost) {
      Proyecto memory p  = proyectosMap[id];
      idProyecto = id;
      user = p.user;
      nombre = p.nombre;
      descripcion = p.descripcion;
      total = p.total;
      acumulado = p.acumulado;
      minimoDonacion = p.minimoDonacion;
      fechaInicio = p.fechaInicio;
      fechaFin = p.fechaFin;
      finalizo = p.finalizo;
      numDonacion = p.numDonacion;
      numPost = p.numPost;
    }
    function obtenerDonacion(uint256 idP,uint256 idD) public view  returns (
        uint256 idDonacion,address user, string memory nickName, bool deseoConfirmenConPost, uint256 donacion, bool transfirio) {
      Proyecto storage p  = proyectosMap[idP];
      Donacion memory d = p.donacionesMap[idD];
      idDonacion = idD;
      user = d.user;
      nickName = d.nickName;
      deseoConfirmenConPost = d.deseoConfirmenConPost;
      donacion = d.donacion;
      transfirio = d.transfirio;
    }
    function postear(uint idProyecto,string memory url) public returns (uint id) {
        Proyecto storage p = proyectosMap[idProyecto];
        require(msg.sender == p.user);
        p.numPost++;
        p.postMap[p.numPost] = Post({ url: url });
        return p.numPost;
    }
    function obtenerPost(uint256 idP,uint256 idPo) public view  returns (
        uint256 idPost, string memory url) {
      Proyecto storage p  = proyectosMap[idP];
      Post memory po = p.postMap[idPo];
      idPost = idPo;
      url = po.url;
    }
    function transferir(uint idProyecto,uint idDonacion) public {
        Proyecto storage p = proyectosMap[idProyecto];
        Donacion storage d = p.donacionesMap[idDonacion];
        require(msg.sender == d.user);
        p.user.transfer(d.donacion);
        p.acumulado = p.acumulado + d.donacion;
        d.transfirio = true;
    }
    function finalizarProyecto(uint idProyecto) public  {
        Proyecto storage p = proyectosMap[idProyecto];
        require(msg.sender == p.user);
        for (uint i = 1; i < p.numDonacion+1; i++) {
            Donacion storage d = p.donacionesMap[i];
            if(!d.transfirio){
                p.user.transfer(d.donacion);
                p.acumulado = p.acumulado + d.donacion;
                d.transfirio = true;
            }
        }
        p.finalizo = true;
    }

}
