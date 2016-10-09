var AnimationClip : AnimationClip ;
function Update() {
	if (Input.GetKeyUp (KeyCode.W)) {
    	GetComponent.<Animation>().Stop();
 	}
}