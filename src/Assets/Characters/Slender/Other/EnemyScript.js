#pragma strict
@script RequireComponent( AudioSource )

public var thePlayer : Transform;
private var theEnemy : Transform;

public var speed : float = 0.7;

var isOffScreen : boolean = false;
public var offscreenDotRange : float = 0.7;

var isVisible : boolean = false; // Whether the player is visible to Slender.
// public var visibleDotRange : float = 0.75; // ** between 0.75 and 0.85 (originally 0.8172719) 

public var followDistance : float = 2.0; // Slender will come closer towards you until this distance is reached. 

public var maxVisibleDistance : float = 30.0; // You can see slender and possible be hit (not hard) by him as long as you are within this distance.

public var maxHittingDistance : float = 8; // Slender can hit you (hard) as long as you are within this distance.

private var sqrDist : float = 0.0;

public var health : float = 100.0;

public var damageFromDistance : float = 10.0;
public var damageFromNearby : float = 30.0;

public var isVeryClose : boolean = false; // Very close is defined by the followDistance.

public var isNearby : boolean = false; // Nearby is defined by the maxHittingDistance.

public var isInRange : boolean = false; // In range is defined by the maxVisibleDistance.

// VeryClose > Nearby > InRange

public var enemySpottedSFX : AudioClip;

public var enemyHittingSFX: AudioClip;

private var hasPlayedSpottedSound : boolean = false;

private var colDist : float = 5.0; // raycast distance in front of enemy when checking for obstacles

public var isGrounded : boolean = false;

// 'Combat' Mechanism:
// Slender sees Player and Player sees Slender => Player gets hit.
// Slender doesn't see Player and Player doesn't see Sleder => Player gets healed.
// Slender sees Player and Player doesn't see Slender (running away from it) => Player doesn't get hit nor gets healed.

function Start() 
{
	if ( thePlayer == null )
	{
		thePlayer = GameObject.Find( "Player" ).transform;
	}
	
	theEnemy = transform;
}

function Update() 
{
	CheckMaxVisibleRange();
	IsGrounded();
	// Movement : check if out-of-view, then move
	CheckIfOffScreen();
	
	// if is Off Screen, move
	if ( isOffScreen )
	{
		MoveEnemy();
		
		// check if Player is seen
		CheckIfVisible();
		
		// Only restore health is the Player is not seen by Slender any more.
		if ( !isVisible ) 
		{
			// restore health
			RestoreHealth();	
		}
		
		// reset hasPlayedSpottedSound for next time isVisible first occurs
		hasPlayedSpottedSound = false;
			
		/*else 
		{
			// This is the sound you hear when you are visible to Slender.
			if ( !hasPlayedSpottedSound )
			{
				GetComponent.<AudioSource>().PlayClipAtPoint( enemySpottedSFX, thePlayer.position ); 
			}
			hasPlayedSpottedSound = true; // sound has now played
		}*/

	}
	else
	{
		// check if Player is seen
		CheckIfVisible();
		
		if ( isVisible )
		{
			// deduct health
			DeductHealth();
			
			// stop moving
			StopEnemy();
			
			// This is the sound you hear when you are visible to Slender.
			if ( !hasPlayedSpottedSound )
			{
				GetComponent.<AudioSource>().PlayClipAtPoint( enemySpottedSFX, thePlayer.position ); 
			}
			hasPlayedSpottedSound = true; // sound has now played
		}
		else
		{
			// check max range
			CheckMaxHittingRange();
			
			// if far away then move, else stop
			if ( !isNearby )
			{
				MoveEnemy();
			}
			else
			{
				StopEnemy();
			}
			
			// restore health
			RestoreHealth();
			
			// reset hasPlayedSpottedSound for next time isVisible first occurs
			hasPlayedSpottedSound = false;
		}
	}
	
}


function DeductHealth() 
{
	CheckMaxHittingRange();
	
	// deduct health
	if ( isNearby )
	{
		health -= damageFromNearby * Time.deltaTime;
		GetComponent.<AudioSource>().PlayClipAtPoint( enemyHittingSFX, thePlayer.position );
	}
	else 
	{
		health -= damageFromDistance * Time.deltaTime;
	}
	// check if no health left
	if ( health <= 0.0 )
	{
		health = 0.0;
		Debug.Log( "YOU ARE OUT OF HEALTH !" );
		
		// Restart game here!
		Application.LoadLevel( "Game Over" );
	}
}


function RestoreHealth() 
{
	CheckMaxHittingRange();
	// restore health
	if ( isNearby )
	{
		health += damageFromNearby * Time.deltaTime;
	}
	else 
	{
		health += damageFromDistance * Time.deltaTime;
	}
	// check if no health left
	if ( health >= 100.0 )
	{
		health = 100.0;
		//Debug.Log( "HEALTH is FULL" );
	}
}


function CheckIfOffScreen() 
{
	//var fwd : Vector3 = thePlayer.forward.normalized;
	var fwd : Vector3 = GameObject.Find("Camera").transform.forward.normalized;
	var other : Vector3 = (theEnemy.position - thePlayer.position).normalized;
	
	var theProduct : float = Vector3.Dot( fwd, other );
	
	if ( theProduct < offscreenDotRange )
	{
		isOffScreen = true;
	}
	else
	{
		isOffScreen = false;
	}
}


function MoveEnemy() 
{

	
	if ( isInRange ) {
	
		// Check the Follow Distance
		CheckFollowDistance();
		
		// if not too close, move
		if ( !isVeryClose )
		{
			GetComponent.<Rigidbody>().velocity = Vector3( 0, GetComponent.<Rigidbody>().velocity.y, 0 ); // maintain gravity
			
			// --
			// Old Movement
			//transform.LookAt( thePlayer );		
			//transform.position += transform.forward * speed * Time.deltaTime;
			// --
			
			// New Movement - with obstacle avoidance
			var dir : Vector3 = ( thePlayer.position - theEnemy.position ).normalized;
			var hit : RaycastHit;
			
			if ( Physics.Raycast( theEnemy.position, theEnemy.forward, hit, colDist ) )
			{
				//Debug.Log( " obstacle ray hit " + hit.collider.gameObject.name );
				if ( hit.collider.gameObject.name != "Player" && hit.collider.gameObject.name != "Terrain" )
				{			
					dir += hit.normal * 20;
				}
			}
		
			var rot : Quaternion = Quaternion.LookRotation( dir );
		
			theEnemy.rotation = Quaternion.Slerp( theEnemy.rotation, rot, Time.deltaTime );
			theEnemy.position += theEnemy.forward * speed * Time.deltaTime;
			//theEnemy.rigidbody.velocity = theEnemy.forward * speed; // Not Working
			
			// --
		}
		else
		{
			StopEnemy();
		}
	}
}


function StopEnemy() 
{
	transform.LookAt( thePlayer );
	
	GetComponent.<Rigidbody>().velocity = Vector3.zero;
}


function CheckIfVisible() 
{
	// var fwd : Vector3 = thePlayer.forward.normalized;
	// var other : Vector3 = ( theEnemy.position - thePlayer.position ).normalized;
	
	// var theProduct : float = Vector3.Dot( fwd, other );
	
	// if ( theProduct > visibleDotRange )
	// {
		
	if ( isInRange )
	{
		// Linecast to check for occlusion
		var hit : RaycastHit;
			
		if ( Physics.Linecast( theEnemy.position, thePlayer.position, hit ) )
		{
			Debug.Log( "Enemy sees " + hit.collider.gameObject.name );

			if ( hit.collider.gameObject.name == "Player" && isGrounded)
			{
				isVisible = true;
			}
			else 
			{
				isVisible = false;
			}
		}
		else 
		{
			isVisible = false;
		}
	}
	else
	{
		isVisible = false;
	}
}


function CheckFollowDistance() 
{
	var sqrDist : float = (theEnemy.position - thePlayer.position).sqrMagnitude;
	var sqrFollowDist : float = followDistance * followDistance;
	
	if ( sqrDist < sqrFollowDist )
	{
		isVeryClose = true;
	}
	else
	{
		isVeryClose = false;
	}	
}

function CheckMaxVisibleRange() 
{
	var sqrDist : float = (theEnemy.position - thePlayer.position).sqrMagnitude;
	var sqrMaxDist : float = maxVisibleDistance * maxVisibleDistance;
	
	if ( sqrDist < sqrMaxDist )
	{
		isInRange = true;
	}
	else
	{
		isInRange = false;
	}	
}


function CheckMaxHittingRange() 
{
	var sqrDist : float = (theEnemy.position - thePlayer.position).sqrMagnitude;
	var sqrMaxDist : float = maxHittingDistance * maxHittingDistance;
	
	if ( sqrDist < sqrMaxDist )
	{
		isNearby = true;
	}
	else
	{
		isNearby = false;
	}	
}


function IsGrounded() 
{	
	var hit: RaycastHit;
	isGrounded = false;
	
	if (Physics.Raycast(Vector3(theEnemy.position.x, 10, theEnemy.position.z), Vector3(0, -1, 0), hit, 20.0)) {
		if (hit.collider.gameObject.name != "Maze" && hit.collider.gameObject.name != "Tank" &&
			hit.collider.gameObject.name != "Truck" && hit.collider.gameObject.name != "polySurface73" && 
			hit.collider.gameObject.name != "tomb_litle_ae.1" && hit.collider.gameObject.name != "Crate" && 
			hit.collider.gameObject.name != "Crate 1" && hit.collider.gameObject.name != "Crate 2" &&
			hit.collider.gameObject.name != "Crate 3" && hit.collider.gameObject.name != "Crate 4" &&
			hit.collider.gameObject.name != "Crate 5" && hit.collider.gameObject.name != "Crate 6") {
			isGrounded = true;
		}
	}
}

function IncreaseSpeed() {
	speed += 0.1;
}

