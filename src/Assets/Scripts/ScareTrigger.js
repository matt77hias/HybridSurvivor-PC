#pragma strict
var face : GameObject;
var screamingSound : AudioClip;
var material : Material;

private var rend : Renderer;

private var enterTrigger = false;
private var hasPlayed = false;

private var distance : float;
var speed = 9.0;
private var startTime: float;

function Start () {
	enterTrigger = false;
	rend = face.GetComponent.<Renderer>();
	rend.enabled = false;
	distance = face.transform.localPosition.z;
}

function Update () {
	if (enterTrigger == true && hasPlayed == false) {
		var distCovered = (Time.time - startTime) * speed;
		var fracJourney = distCovered / distance;
		
		if (fracJourney > 1.0) {
			hasPlayed = true;
			rend.enabled = false;
		} else {
			face.transform.localPosition.z= (1.0-fracJourney) * distance;
		}
	}
}

function OnTriggerEnter(col : Collider) {
	if (col.gameObject.tag == "Player" && hasPlayed == false && enterTrigger == false) {
		enterTrigger = true;
		startTime = Time.time;

		GetComponent.<AudioSource>().PlayOneShot(screamingSound);
		rend.enabled = true;
		rend.material = material;
	}
}