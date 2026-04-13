import threading
import time
import random
import math
from collections import deque
from datetime import datetime
from enum import Enum


class TaskStatus(Enum):
    PENDING = "pending"
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"


class TaskPriority(Enum):
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4


TASK_TYPES = {
    "compute_fibonacci": {
        "name": "Compute Fibonacci",
        "description": "Calculate the nth Fibonacci number recursively",
        "category": "computation",
    },
    "matrix_multiply": {
        "name": "Matrix Multiplication",
        "description": "Multiply two random NxN matrices",
        "category": "computation",
    },
    "prime_sieve": {
        "name": "Prime Number Sieve",
        "description": "Find all prime numbers up to N using Sieve of Eratosthenes",
        "category": "computation",
    },
    "sort_dataset": {
        "name": "Sort Dataset",
        "description": "Sort a large random dataset using merge sort",
        "category": "data_processing",
    },
    "text_analysis": {
        "name": "Text Analysis",
        "description": "Analyze text for word frequency, character distribution",
        "category": "data_processing",
    },
    "simulate_io": {
        "name": "Simulate I/O Operation",
        "description": "Simulate a long-running I/O operation with random delay",
        "category": "io",
    },
    "hash_computation": {
        "name": "Hash Computation",
        "description": "Compute hash chains for data integrity verification",
        "category": "security",
    },
    "data_aggregation": {
        "name": "Data Aggregation",
        "description": "Aggregate and summarize a large random dataset",
        "category": "data_processing",
    },
}


def execute_task(task_type, params):
    if task_type == "compute_fibonacci":
        n = params.get("n", 30)
        result = _fibonacci(min(n, 35))
        return {"fibonacci_number": result, "n": n}

    elif task_type == "matrix_multiply":
        size = params.get("size", 50)
        a = [[random.random() for _ in range(size)] for _ in range(size)]
        b = [[random.random() for _ in range(size)] for _ in range(size)]
        result = [[sum(a[i][k] * b[k][j] for k in range(size)) for j in range(size)] for i in range(size)]
        return {"matrix_size": size, "result_checksum": round(sum(sum(row) for row in result), 4)}

    elif task_type == "prime_sieve":
        n = params.get("n", 10000)
        primes = _sieve(min(n, 100000))
        return {"count": len(primes), "largest": primes[-1] if primes else 0, "n": n}

    elif task_type == "sort_dataset":
        size = params.get("size", 10000)
        data = [random.randint(0, 1000000) for _ in range(size)]
        sorted_data = _merge_sort(data)
        return {"dataset_size": size, "min": sorted_data[0], "max": sorted_data[-1], "median": sorted_data[size // 2]}

    elif task_type == "text_analysis":
        text = params.get("text", "The quick brown fox jumps over the lazy dog " * 100)
        words = text.lower().split()
        freq = {}
        for w in words:
            freq[w] = freq.get(w, 0) + 1
        top_words = sorted(freq.items(), key=lambda x: -x[1])[:10]
        return {"word_count": len(words), "unique_words": len(freq), "top_words": dict(top_words)}

    elif task_type == "simulate_io":
        duration = params.get("duration", random.uniform(2, 8))
        time.sleep(min(duration, 10))
        return {"duration": round(duration, 2), "status": "io_complete"}

    elif task_type == "hash_computation":
        iterations = params.get("iterations", 50000)
        value = "taskforge_seed"
        for i in range(min(iterations, 100000)):
            value = str(hash(value + str(i)))
        return {"iterations": iterations, "final_hash": value[:16]}

    elif task_type == "data_aggregation":
        size = params.get("size", 50000)
        data = [random.gauss(100, 25) for _ in range(size)]
        mean = sum(data) / len(data)
        variance = sum((x - mean) ** 2 for x in data) / len(data)
        return {
            "dataset_size": size,
            "mean": round(mean, 4),
            "std_dev": round(math.sqrt(variance), 4),
            "min": round(min(data), 4),
            "max": round(max(data), 4),
        }

    return {"error": "Unknown task type"}


def _fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b


def _sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    return [i for i, v in enumerate(is_prime) if v]


def _merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = _merge_sort(arr[:mid])
    right = _merge_sort(arr[mid:])
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result


class Worker:
    def __init__(self, worker_id, queue_ref):
        self.id = worker_id
        self.status = "idle"
        self.current_task = None
        self.tasks_completed = 0
        self.tasks_failed = 0
        self.total_processing_time = 0
        self.started_at = datetime.now().isoformat()
        self.last_heartbeat = datetime.now().isoformat()
        self.queue = queue_ref
        self.thread = None
        self.running = True

    def start(self):
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def _run(self):
        while self.running:
            task = self.queue._dequeue_task()
            if task:
                self._process_task(task)
            else:
                time.sleep(0.5)

    def _process_task(self, task):
        self.status = "busy"
        self.current_task = task["id"]
        task["status"] = TaskStatus.RUNNING.value
        task["worker_id"] = self.id
        task["started_at"] = datetime.now().isoformat()
        self.queue._notify("task_update", task)

        start_time = time.time()
        try:
            if random.random() < 0.1:
                raise Exception("Simulated random failure")

            result = execute_task(task["type"], task.get("params", {}))
            elapsed = time.time() - start_time

            task["status"] = TaskStatus.COMPLETED.value
            task["result"] = result
            task["completed_at"] = datetime.now().isoformat()
            task["processing_time"] = round(elapsed, 3)

            self.tasks_completed += 1
            self.total_processing_time += elapsed

        except Exception as e:
            elapsed = time.time() - start_time
            task["retries"] = task.get("retries", 0) + 1

            if task["retries"] < task.get("max_retries", 3):
                task["status"] = TaskStatus.RETRYING.value
                task["error"] = str(e)
                self.queue._requeue_task(task)
            else:
                task["status"] = TaskStatus.FAILED.value
                task["error"] = str(e)
                task["completed_at"] = datetime.now().isoformat()
                task["processing_time"] = round(elapsed, 3)
                self.tasks_failed += 1

        self.status = "idle"
        self.current_task = None
        self.last_heartbeat = datetime.now().isoformat()
        self.queue._notify("task_update", task)
        self.queue._notify("worker_update", self.to_dict())

    def stop(self):
        self.running = False

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "current_task": self.current_task,
            "tasks_completed": self.tasks_completed,
            "tasks_failed": self.tasks_failed,
            "total_processing_time": round(self.total_processing_time, 3),
            "started_at": self.started_at,
            "last_heartbeat": self.last_heartbeat,
        }


class DistributedTaskQueue:
    def __init__(self, num_workers=4, socketio=None):
        self.tasks = {}
        self.queue = deque()
        self.priority_queue = {p.value: deque() for p in TaskPriority}
        self.workers = {}
        self.lock = threading.Lock()
        self.socketio = socketio
        self.task_counter = 0
        self.created_at = datetime.now().isoformat()

        for i in range(num_workers):
            worker_id = f"worker-{i+1}"
            worker = Worker(worker_id, self)
            self.workers[worker_id] = worker
            worker.start()

    def _notify(self, event, data):
        if self.socketio:
            self.socketio.emit(event, data)

    def submit_task(self, task_type, params=None, priority="NORMAL", max_retries=3):
        with self.lock:
            self.task_counter += 1
            task_id = f"task-{self.task_counter:04d}"

        task = {
            "id": task_id,
            "type": task_type,
            "type_info": TASK_TYPES.get(task_type, {}),
            "params": params or {},
            "priority": priority,
            "status": TaskStatus.QUEUED.value,
            "created_at": datetime.now().isoformat(),
            "started_at": None,
            "completed_at": None,
            "worker_id": None,
            "result": None,
            "error": None,
            "retries": 0,
            "max_retries": max_retries,
            "processing_time": None,
        }

        with self.lock:
            self.tasks[task_id] = task
            p = TaskPriority[priority].value
            self.priority_queue[p].append(task_id)

        self._notify("task_update", task)
        return task

    def _dequeue_task(self):
        with self.lock:
            for p in sorted(self.priority_queue.keys(), reverse=True):
                if self.priority_queue[p]:
                    task_id = self.priority_queue[p].popleft()
                    return self.tasks.get(task_id)
        return None

    def _requeue_task(self, task):
        with self.lock:
            p = TaskPriority[task["priority"]].value
            self.priority_queue[p].append(task["id"])

    def cancel_task(self, task_id):
        with self.lock:
            task = self.tasks.get(task_id)
            if task and task["status"] in [TaskStatus.QUEUED.value, TaskStatus.PENDING.value]:
                task["status"] = TaskStatus.CANCELLED.value
                task["completed_at"] = datetime.now().isoformat()
                self._notify("task_update", task)
                return True
        return False

    def get_task(self, task_id):
        return self.tasks.get(task_id)

    def get_all_tasks(self):
        return list(self.tasks.values())

    def get_workers(self):
        return [w.to_dict() for w in self.workers.values()]

    def get_stats(self):
        tasks = list(self.tasks.values())
        completed = [t for t in tasks if t["status"] == TaskStatus.COMPLETED.value]
        failed = [t for t in tasks if t["status"] == TaskStatus.FAILED.value]
        running = [t for t in tasks if t["status"] == TaskStatus.RUNNING.value]
        queued = [t for t in tasks if t["status"] in [TaskStatus.QUEUED.value, TaskStatus.RETRYING.value]]

        avg_time = 0
        if completed:
            avg_time = sum(t["processing_time"] for t in completed) / len(completed)

        workers = self.get_workers()
        busy_workers = sum(1 for w in workers if w["status"] == "busy")

        return {
            "total_tasks": len(tasks),
            "completed": len(completed),
            "failed": len(failed),
            "running": len(running),
            "queued": len(queued),
            "cancelled": sum(1 for t in tasks if t["status"] == TaskStatus.CANCELLED.value),
            "avg_processing_time": round(avg_time, 3),
            "total_workers": len(workers),
            "busy_workers": busy_workers,
            "idle_workers": len(workers) - busy_workers,
            "throughput": round(len(completed) / max(1, (time.time() - datetime.fromisoformat(self.created_at).timestamp())), 4),
            "success_rate": round(len(completed) / max(1, len(completed) + len(failed)) * 100, 1),
            "created_at": self.created_at,
        }

    def clear_completed(self):
        with self.lock:
            to_remove = [tid for tid, t in self.tasks.items() if t["status"] in [TaskStatus.COMPLETED.value, TaskStatus.FAILED.value, TaskStatus.CANCELLED.value]]
            for tid in to_remove:
                del self.tasks[tid]
            return len(to_remove)
