//Script playdomy
var TextureCrosshair : Texture2D; 

var TextureUsa : Texture2D;
 
var TextureNormale : Texture2D;
     
var MostraCrosshair : boolean = true;
 
var Cambia : boolean = false;
         
function Start()
{      
        Screen.lockCursor = true;
}
         
function OnGUI()
{       //Mostra Crosshair
        if(MostraCrosshair == true)
        {
        //Cordinate per dire allo script dove posizionare la texture 
        GUI.Label(Rect((Screen.width - TextureCrosshair.width) /2, (Screen.height -
                        TextureCrosshair.height) /2, TextureCrosshair.width, TextureCrosshair.height), TextureCrosshair);
        }
 
}
 
//Cambia il cursore in "TextureUsa" quando si entra nel trigger e si punta un'oggetto con il target Porta 
function OnTriggerEnter(other : Collider)
{
        if(other.gameObject.tag == "Porta")
        {
                Cambia = false;
       
                TextureCrosshair = TextureUsa;
       
        }
 
}
//Cambia il cursore in "TextureNormale" quando si esce dal trigger   
function OnTriggerExit(other : Collider)
{
        if(other.gameObject.tag == "Porta")
        {
                Cambia = true;
       
                TextureCrosshair = TextureNormale;
               
               
        }
 
}
//Funzione cambio texture 
function TextureChange(){
 
if(!Cambia)
{
 
TextureCrosshair = TextureUsa;
 
Cambia = true;
 
}
 
}
//Funzione che cambierà la texture a quella normale  
function BackToNormal(){
 
if(Cambia)
{
 
Cambia = false;
 
TextureCrosshair = TextureNormale;
}
 
}