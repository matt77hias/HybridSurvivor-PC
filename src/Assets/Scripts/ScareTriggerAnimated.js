#pragma strict

var face : GameObject;
private var enterTrigger = false;
private var hasPlayed = false;
private var faceEnabled = false;
var screamingSound : AudioClip;

var player : GameObject;
private var startPos: Vector3;
private var endPos: Vector3;
var speed = 30.0;
private var startTime: float;
private var distance: float;

var framesLeft = 34;

var columns = 7;

var rows = 25;
var fps = 30.0;

function Start () {
	enterTrigger = false;
	startPos = face.transform.position;
	face.GetComponent.<Renderer>().enabled = false;
}

function OnTriggerEnter(other : Collider) {
	if (hasPlayed == false && enterTrigger == false) {

				
		

		startTime = Time.time;
		endPos = player.transform.position;
		distance = Vector3.Distance(startPos, endPos);	
		
		
		GetComponent.<AudioSource>().PlayOneShot(screamingSound);
	
		face.GetComponent.<Renderer>().enabled = true;
		enterTrigger = true;
	}
}


function Update () {

	if (enterTrigger == true && hasPlayed == false ) {		
				
		var index : int = Time.time * fps;

		index = index % (columns * rows);

		var size = Vector2 (1.0 / columns, 1.0 / rows);

		var columnIndex = index % columns;
		var rowIndex = index / columns;

		var offset = Vector2 (columnIndex * size.x, 1.0 - size.y - rowIndex * size.y);

		face.GetComponent.<Renderer>().material.SetTextureOffset ("_MainTex", offset);
		face.GetComponent.<Renderer>().material.SetTextureScale ("_MainTex", size);
		
		framesLeft -= 1;
		// TODO: oplossing voor vinden...
		if (framesLeft == 0) {
			DestroyObject (face);
			hasPlayed = true;
		}
	}
}
