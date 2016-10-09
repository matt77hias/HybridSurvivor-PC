using UnityEngine;
using System.Collections;

public class FlickeringLight : MonoBehaviour {

	private int randomizer = 0;

	public Light closeLight;
	public Light farLight;
	private bool closeActive;

	void Start() {
		closeActive = true;
		closeLight.enabled = true;
		farLight.enabled = false;
	}

	void Update() {
		if (Input.GetMouseButtonDown(1)) {
			closeLight.enabled = !closeActive;
			farLight.enabled = closeActive;
			closeActive = !closeActive;
		}

		if (PowerCellInventory.charge < 2) {
			StartCoroutine(Flicker ());
		}
	}

	IEnumerator Flicker () {
		if (closeActive) {
			if (randomizer != 0)
				closeLight.enabled = false;
			else 
				closeLight.enabled = true;
		} else {
			if (randomizer != 0)
				farLight.enabled = false;
			else 
				farLight.enabled = true;
		}
		randomizer = (int) Random.Range(0f, 1.1f);
		float period = (float) Random.Range(0.03f, 1.4f);
		yield return new WaitForSeconds (period);
	}
}