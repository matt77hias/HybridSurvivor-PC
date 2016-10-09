/// created by MasterDevelopers ///
#pragma strict
@script RequireComponent(MeshFilter, MeshRenderer)
 
var theAlpha : float = 0.0;
 
var theCamera : Camera;
var cameraTransform : Transform;
 
private var mesh : Mesh;
 
private var uv : Vector2[];
private var verts : Vector3[];
private var tris : int[];
private var normals : Vector3[];
 
public var distance : float = 1.0;
 
private var theMaterial : Material;
 
var theEnemy : EnemyScript;
 
 
function Start() 
{
    Startup();
 
    // find and store a reference to the enemy script (to use health as alpha for texture)
    if ( theEnemy == null )
    {
       theEnemy = GameObject.Find( "Enemy" ).GetComponent( EnemyScript );
    }
}
 
function Update() 
{
    SetAlpha();
 
    ScrollUVs();
}
 
 
function SetAlpha() 
{
    theAlpha = ( 100.0 - theEnemy.health ) * 0.01;
 
    theMaterial.color = Color( theMaterial.color.r, theMaterial.color.g, theMaterial.color.b, theAlpha );
}
 
 
function ScrollUVs() 
{
    var scrollX : float = Random.Range( -0.5, 0.5 );
    var scrollY : float = Random.Range( -0.5, 0.5 );
 
    // UVs
    for ( var i:int = 0; i < 4; i ++ )
    {
       uv[i] = new Vector2( uv[i].x + scrollX, uv[i].y + scrollY );
    }
 
    mesh.uv = uv;  
}
 
 
// ----
 
function Startup() 
{
    if ( theCamera == null )
    {
       theCamera = Camera.main;
    }
    cameraTransform = theCamera.transform;
 
    theMaterial = gameObject.GetComponent.<Renderer>().material;
    theMaterial.color = Color.white;
 
    if ( !mesh )
    {
       GetComponent(MeshFilter).mesh = mesh = new Mesh();
       mesh.name = "ScreenMesh";
    }
 
    Construct();
 
    //DebugVerts();
}
 
function Construct() 
{
    mesh.Clear();
 
    verts = new Vector3[4]; 
    uv = new Vector2[4];
    tris = new int[6];
    normals = new Vector3[4]; 
 
    // calculate verts based on camera FOV
    var pos : Vector3 = cameraTransform.position - transform.position;
 
    var halfFOV : float = ( theCamera.fieldOfView * 0.5 ) * Mathf.Deg2Rad;
    var aspect : float = theCamera.aspect;
    //Debug.Log( " Screen.width " + Screen.width + " : Screen.height " + Screen.height + " : aspect " + aspect );
 
    var height : float = distance * Mathf.Tan( halfFOV );
    var width : float = height * aspect;
 
    //Debug.Log( " fieldOfView " + theCamera.fieldOfView + " : aspect " + aspect );
 
    // UpperLeft
    verts[0] = pos - (cameraTransform.right * width);
    verts[0] += cameraTransform.up * height;
    verts[0] += cameraTransform.forward * distance;
 
    // UpperRight
    verts[1] = pos + (cameraTransform.right * width);
    verts[1] += cameraTransform.up * height;
    verts[1] += cameraTransform.forward * distance;
 
    // LowerLeft
    verts[2] = pos - (cameraTransform.right * width);
    verts[2] -= cameraTransform.up * height;
    verts[2] += cameraTransform.forward * distance;
 
    // LowerRight
    verts[3] = pos + (cameraTransform.right * width);
    verts[3] -= cameraTransform.up * height;
    verts[3] += cameraTransform.forward * distance;
 
 
    // UVs
    uv[0] = new Vector2( 0.0, 1.0 );
    uv[1] = new Vector2( 1.0, 1.0 );
    uv[2] = new Vector2( 0.0, 0.0 );
    uv[3] = new Vector2( 1.0, 0.0 );
 
    // Triangles
    tris[0] = 0;
    tris[1] = 1;
    tris[2] = 2;
    tris[3] = 2;
    tris[4] = 1;
    tris[5] = 3;
 
    // Normals
    normals[0] = -Vector3.forward;
    normals[1] = -Vector3.forward;
    normals[2] = -Vector3.forward;
    normals[3] = -Vector3.forward;
 
    // assign mesh
    mesh.vertices = verts; 
    mesh.uv = uv;
    mesh.triangles = tris;
    mesh.normals = normals;
 
    mesh.RecalculateBounds();
    mesh.RecalculateNormals();
}
 
/*
function DebugVerts() 
{     
    // Debug Positions
    Debug.Log( " UL " + verts[0] + " : UR " + verts[1] );
    Debug.Log( " LL " + verts[2] + " : LR " + verts[3] );
}
*/