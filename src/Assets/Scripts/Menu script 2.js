var beep : AudioClip;

var pressed : boolean;

function Start() {
	pressed = false;
}

function Update() {
	if (!pressed && Input.GetKeyDown(KeyCode.Return)) {
	   pressed = true;
	   Load_Scene();
	}
	if (!pressed && Input.GetKeyDown(KeyCode.Escape)) {
	   pressed = true;
	   Quit_Scene();
	}
	
}

function Load_Scene() {
	GetComponent.<AudioSource>().PlayOneShot(beep);
	yield new WaitForSeconds(0.35);
	Application.LoadLevel("Scene");
}

function Quit_Scene() {
	GetComponent.<AudioSource>().PlayOneShot(beep);
	yield new WaitForSeconds(0.35);
	Application.LoadLevel("Main Menu");
}

@script RequireComponent(AudioSource)