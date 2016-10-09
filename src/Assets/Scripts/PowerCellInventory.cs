using UnityEngine;
using System.Collections;

public class PowerCellInventory : MonoBehaviour {
	
	// Cells
	public static int charge = 0;
	private int minCharge = 0;
	private int maxCharge = 4;
	public AudioClip collectSound;
	
	public int decreaseTime = 300;
	private IEnumerator coroutine;
	
	// HUD
	public Texture2D[] hudCharge;
	public GUITexture chargeHudGUI;
	
	void Start () {
		charge = 3;
		chargeHudGUI.texture = hudCharge[charge];
		chargeHudGUI.enabled = true;
		coroutine = DecreasePower();
		StartCoroutine(coroutine);
	}

	void CellPickup() {
		AudioSource.PlayClipAtPoint(collectSound, transform.position);
		if (charge < maxCharge) {
			chargeHudGUI.texture = hudCharge[++charge];
		}
	}

	IEnumerator DecreasePower() {
		while(true) {
			--charge;
			if (charge <= minCharge) {
				break;
			} else {
				chargeHudGUI.texture = hudCharge[charge];
			}
			yield return new WaitForSeconds(decreaseTime);
		}
		Application.LoadLevel( "Game Over" );
	}
}
