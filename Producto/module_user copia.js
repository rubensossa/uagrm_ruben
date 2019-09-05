 
var REGISTRAR="Guardar";
var TITULO = "Usuarios";
var TABLA = "system_usuario";
var PK = "id";

//Layout
var layout = new WLayout();  

//Tabla: usuario
var layout_data= new WLayout();
var id= new WKey( "Código", "id");
var nombre= new WText( "Nombre", "nombre");
var login= new WText( "Login", "login");
var contrasenia= new WPassword( "Password", "contrasenia");
var email= new WMail( "Email", "email");
var celular= new WChip( "Celulares", "celular");
var telefonos= new WChip( "Telefonos", "telefonos");
//var grupo= new WAutofind( "Grupo", "id_grupo", "select id,nombre from grupo order by nombre");
var grupo= new WSelect( "Grupo", "id_grupo", "select id,nombre from system_grupo order by nombre");

var fecha_cambio= new WCalendar( "Fecha cambio", "fecha_cambio");
var inicio= new WText( "Inicio", "inicio");
var activo= new WRadioButton( "Activo", "activo", "select 'SI' as id,'Activo' as nombre union select 'NO' as id,'Inactivo' as nombre");


var fecha_nacimiento= new WCalendar( "Fecha Nac.", "fecha_nacimiento");
var sexo= new WRadioButton( "Sexo", "sexo", "select 'H' as id,'Hombre' as nombre union select 'M' as id,'Mujer' as nombre");
var ciudad= new WText( "Ciudad", "ciudad");
var oficina= new WText( "Oficina", "oficina");
var foto= new WAttached( "", "foto");  
var image=new WImage("Fotografía","/system/images/clave.jpg",2,1);
 


//Controles
var layout_botton = new WLayout();
var guardar = new WButton(REGISTRAR);
var nuevo = new WButton("Nuevo");
var buscar = new WButton("Editar", WButton.BUTTON_SELECT_SINGLE);
var eliminar = new WButton("Eliminar", WButton.BUTTON_SELECT_MULTIPLE);
 

//Base de Datos
var database = new WDatabase();


function init() {
    
        //Codes
        guardar.setCode("add") ;
        buscar.setCode("find");
        eliminar.setCode("del"); 
        
        //Datos Requeridos...
        nombre.setRequired(true);
        login.setRequired(true);
//        grupo.setAutocomplete(true);
        image.setSize(100,100);
        image.setAling("center"); 
        foto.setFormatImage(); 
        foto.setChangeEvent("selectedImage"); 
         
        //Guardar, Nuevo , Eliminar, Buscar, Reporte
        guardar.setMethod("guardarme");
        //guardar.setAjax(false); 
        //guardar.setWait(true);
        nuevo.setMethod("limpiar");
        eliminar.setMethod("eliminarme");
        grupo.setCreate(true,"module_rol.js");
        
		// top <limit> 
        var separador=WDatabase.getConcatenate();
        var sqlQuery="select  * from (select  system_usuario.id as código, system_usuario.nombre, login,system_grupo.nombre as grupo,  \n\
      \n\
         '<img src=\"../../../../' "+separador+"foto"+separador+"'\" style=\"width:70px; height: 70px; text-align: center\"  />' as foto,\n\
                 email,celular,telefonos,activo,sexo, oficina, ciudad \n\
   from system_usuario left join system_grupo on system_grupo.id=id_grupo) as t <Where> order by login";
     
        eliminar.setSql(sqlQuery);
        buscar.setMethod("buscarme");
        buscar.setSql(sqlQuery);
        buscar.setClose(true);
        
        
	layout_data.addLayoutColumns(id);
        layout_data.addLayoutCount(2,
                nombre, grupo,
                sexo, fecha_nacimiento 
                );

        
//        var  title=new WPanel("Datos de Contacto",4,1); 
     //   layout_data.addLayoutRows(title);

        layout_data.addLayoutCount(2,
                email, celular,
                ciudad, telefonos,
                oficina 
                );

//        title=new WPanel("Login y Password",4,1); 
       // layout_data.addLayoutRows(title);

        layout_data.addLayoutCount(2, 
                login, contrasenia  
                , activo  
                );
	layout_botton.addLayoutColumns(guardar, nuevo, buscar, eliminar);
        
           
//        temp.setChangeEvent("eventChange"); 
//        layout_data.addLayoutRows(temp);
        
        var layout_derecha=new WLayout();
        layout_derecha.addLayoutRows(image, foto);
        layout.addLayout(1, 1, layout_data, layout_derecha); 
	layout.addLayout(1, 1, layout_botton);
        
        /*
	layout.addLayout( 2, 1,layout_data);
	layout.addLayout( 2, 1,layout_botton);
        */
 
        principal.setModel(layout);
        
}
//        var temp=  new WAutofind("a","ss","select  id,nombre from logico");  //WAutofind, WSuggest

//function eventChange()
//{ 
//    Print.WriteLine("eventChange "+temp.getValueObject());
//    
//}

function selectedImage()
{
   updateImage();
   principal.updateUI(); 
}

function updateImage()
{
    Print.WriteLine("Foto: "+foto.getValue());
    if (foto.isExists())
      image.setIcon(foto.getUrl());
            else
                image.setIcon("system/images/clave.jpg"); 
}
 
function guardarme() { 
    database.init(TABLA, layout_data,foto); 
    nombre.setVisible(false);
    var result = database.saveTable();
    if (result){
        principal.showInformation('Guardo Correctamente ' + TITULO, '');
    }
    else {
        principal.showError('Error al Guardar: ', database.getError()  );
    }
    principal.updateUI();
}


function buscarme()
{
    var result = buscar.getRowsSelected().size() > 0;
    if (result){
        database.init(TABLA, layout_data,foto);
        result = database.loadTable(buscar.getRowsSelected().get(0).getValue(0)); 
    }
    if (result) {
        updateImage();
        principal.showInformation('Abrio Correctamente', '');
    }
    else {
        principal.showError('Error al Buscar: ', 'Error al Abrir ' + database.getError());
    }
    principal.updateUI();

}
   

 function limpiar() {
    layout_data.clear(); 
    foto.clear();
    image.setIcon("system/images/clave.jpg"); 
    principal.showInformation('Nuevo ' + TITULO, 'Limpiar');
    principal.updateUI();
}
     
   

function eliminarme()
{
    database.init(TABLA, layout_data);
    var count = eliminar.getRowsSelected().size();
    database.deleteSelected(eliminar.getRowsSelected());
    eliminar.clearSelected();
    principal.showInformation('Eliminarme', 'Elimino ' + count + ' ' + TITULO);
//    eliminar.updateUI();
}
