var player : Transform;      // the Object the player is controlling
var spawnOrgin : Vector3;     // this will be the bottom right corner of a square we will use as the spawn area
var maximum : Vector3;        // max distance in the x, y, and z direction the enemy can spawn
var spawnRate : float = 12;        // how often the enemy will respawn

var spawnRateReduce : float = 4;

var distanceToPlayer : float = 30; // how close the enemy has to be to the player to play music

private var nearPlayer : boolean = false; // use this to stop the teleporting if near the player
private var nextTeleport : float = 0.0f; // will keep track of when we to teleport next

public var collided : boolean = false;

private var previousTeleport : float;

function Start ()
{
    previousTeleport = Time.time;
}

function Update ()
{
    if (!nearPlayer)     // only teleport if we are not close to the player
    {
        if (Time.time - previousTeleport  > spawnRate)   // only teleport if enough time has passed
        {      	
            transform.position = Vector3( Random.Range(spawnOrgin.x, maximum.x), Random.Range(spawnOrgin.y, maximum.y), Random.Range(spawnOrgin.z, maximum.z) );   // teleport
            previousTeleport = Time.time;
        }
    }
    if (Vector3.Distance(transform.position, player.position) <= distanceToPlayer)
    {
         //if (GetComponent.<AudioSource>() && GetComponent.<AudioSource>().clip && !GetComponent.<AudioSource>().isPlaying)     // play the audio if it isn't playing
         //     GetComponent.<AudioSource>().Play();
         nearPlayer = true;
    }
    else
    {
         //if (GetComponent.<AudioSource>())
         //   GetComponent.<AudioSource>().Stop();
         nearPlayer = false;
    }
}

function ReduceSpawnRate() {
	spawnRate -= spawnRateReduce;
}	