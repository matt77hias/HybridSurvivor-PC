using UnityEngine;
using System.Collections;

public class Key : MonoBehaviour {

	public float rotationSpeed = 100.0f;

	void Update () {
		transform.Rotate(new Vector3(rotationSpeed * Time.deltaTime,0,0));
	}
	
	void OnTriggerEnter(Collider col) {
		if (col.gameObject.tag == "Player") {
			col.gameObject.SendMessage("KeyPickup");
			Destroy(gameObject);
		}	
	}
}
