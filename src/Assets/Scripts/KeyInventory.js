    
    var theEnemy : EnemyScript;
    
    private var keys = 0;
    private var nb_keys = 3;
    var collectSound : AudioClip;
    
    var crypt : GameObject;
    
    // HUD
	var hudKey = new Texture2D[nb_keys + 1];
	var keyHudGUI : GUITexture;
     
    function Start() {
    	// find and store a reference to the enemy script (to reduce distance after each paper is collected)
    	if (theEnemy == null) {
    		theEnemy = GameObject.Find( "Enemy" ).GetComponent( EnemyScript );
    	}
    	
    	keyHudGUI.enabled = true;
    	UpdateHUD();
    }
     
     
    function Update() {
    }
    
    function KeyPickup() {
    	AudioSource.PlayClipAtPoint(collectSound, transform.position);
    	++keys;
    	if (keys == nb_keys) {
    		Destroy(crypt.GetComponent.<Collider>());
    	}
    	UpdateHUD();
    	//theEnemy.ReduceSpawnRate();
    	theEnemy.IncreaseSpeed();
    } 
     
    function UpdateHUD() {
	    keyHudGUI.texture = hudKey[keys];
    }