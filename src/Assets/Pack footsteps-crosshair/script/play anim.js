var AnimationClip : AnimationClip ;
function Update() {
	if (Input.GetKeyDown (KeyCode.W)) {
		GetComponent.<Animation>().Play();
	}
}
