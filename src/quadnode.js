/**
     * A point in 2D space
     */
export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `Point(${this.x}, ${this.y})`;
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}

/**
 * A node in a quadtree.
 * 
 * Order of children:
 *  0 | 1
 * ---+---
 *  2 | 3
 * 
 * static properties:
 * - SPLIT_THRESHOLD: max number of points in a leaf node before it splits into 4 children
 * 
 * @property {number} w - width of the node
 * @property {number} h - height of the node
 * @property {number} x - x coordinate of top left corner of the node
 * @property {number} y - y coordinate of top left corner of the node
 * @property {QuadNode} parent - parent node
 * @property {QuadNode[]} children - children of this node
 * @property {Point[]} points - points contained in this node
 */
export class QuadNode {
  static SPLIT_THRESHOLD = 4;
  constructor(w, h, id, x = 0, y = 0, parent = null) {
    this.id = id;
    this.w = w;
    this.hw = w / 2;
    this.h = h;
    this.x = x;
    this.y = y;
    this.parent = parent;

    this.children = [];
    this.points = [];
  }

  /**
   * @returns {boolean} true if this node is a branch node
   */
  has_children() {
    return this.children.length > 0;
  }

  /**
   * Insert a point into the tree
   * 
   * @param {Point} point - the point to insert
   */
  insert(point) {
    // check if this point is within the bounds of this node
    if (point.x < this.x || point.x >= this.x + this.w || point.y < this.y || point.y >= this.y + this.h) {
      throw new Error('Point is out of range');
    }

    if (this.has_children()) {
      // insert into child node
      const idx = Number(point.x >= this.x + this.hw) + Number(point.y >= this.y + this.h / 2) * 2;
      this.children[idx].insert(point);
    } else {
      // if identical point already exists, don't insert. 
      // This is to prevent infinite splitting
      if (this.points.some(p => p.equals(point))) {
        return;
      }

      // insert into this node and split if necessary
      this.points.push(point);

      this.check_split();
    }
  }

  /**
   * Split this node into 4 children if there are more than SPLIT_THRESHOLD points in this node
   */
  check_split() {
    if (this.points.length <= QuadNode.SPLIT_THRESHOLD) {
      return;
    }
    const w = this.hw;
    const h = this.h / 2;
    this.children = [
      new QuadNode(w, h, [...this.id, 0], this.x, this.y, this),
      new QuadNode(this.w - w, h, [...this.id, 1], this.x + w, this.y, this),
      new QuadNode(w, this.h - h, [...this.id, 2], this.x, this.y + h, this),
      new QuadNode(this.w - w, this.h - h, [...this.id, 3], this.x + w, this.y + h, this),
    ];
    for (const p of this.points) {
      this.insert(p);
    }
    this.points = [];
  }

  /**
   * Get the leaf node that contains the given point. 
   * 
   * Assume given point is within the bounds of this node.
   * 
   * @param {Point} point - the point to search for
   * @returns {QuadNode} the node that contains the point
   */
  get_containing_node(point) {
    if (this.has_children()) {
      const idx = Number(point.x >= this.x + this.hw) + Number(point.y >= this.y + this.h / 2) * 2;
      return this.children[idx].get_containing_node(point);
    } else {
      return this;
    }
  }

  /**
   * Check if this node contains a given point.
   * 
   * @param {Point} point 
   * @returns 
   */
  do_contain_point(point) {
    return point.x >= this.x && point.x < this.x + this.w && point.y >= this.y && point.y < this.y + this.h;
  }

  /**
   * Check if this node overlaps with given node.
   */
  overlap(other) {
    return !(
      this.x + this.w < other.x ||
      other.x + other.w < this.x ||
      this.y + this.h < other.y ||
      other.y + other.h < this.y
    );
  }

  /**
   * Search for points within a given rectangular range
   * 
   * @param {number} x - x coordinate of center of range
   * @param {number} y - y coordinate of center of range
   * @param {number} radius - radius of range
   * @returns {[[Point, number]]} generator that iterates all points and distance square within range
   */
  * search_range(x, y, radius) {
    let r2 = radius * 2;
    yield* this._search_range(new QuadNode(r2, r2, [], x - radius, y - radius), radius * radius);
  }

  /**
   * @param {QuadNode} node 
   * @param {number} radius 
   * @returns 
   */
  * _search_range(node, radius) {
    // If this node does not overlap with the given node, no points are in range. 
    if (!this.overlap(node)) {
      return;
    }
    if (this.has_children()) {
      // search children
      for (const c of this.children) {
        yield* c._search_range(node, radius);
      }
    } else {
      // search points
      for (const p of this.points) {
        let d = (node.x + node.hw - p.x) ** 2 + (node.y + node.h / 2 - p.y) ** 2;
        if (d <= radius) {
          yield [p, d];
        }
      }
    }
  }

  /**
   * Draw lines on the canvas to show nodes of the quadtree. 
   * 
   * @param {CanvasRenderingContext2D} ctx - the canvas context to draw on
   * @param {string} line_color - the color of the lines
   */
  draw_line(ctx, line_color) {
    if (!this.has_children()) {
      return;
    }
    for (const c of this.children) {
      c.draw_line(ctx, line_color);
    }
    ctx.strokeStyle = line_color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x + this.hw, this.y);
    ctx.lineTo(this.x + this.hw, this.y + this.h);
    ctx.moveTo(this.x, this.y + this.h / 2);
    ctx.lineTo(this.x + this.w, this.y + this.h / 2);
    ctx.stroke();
  }

  /**
   * Draw points on the canvas. 
   */
  draw_points(ctx, point_color, point_radius) {
    for (const c of this.children) {
      c.draw_points(ctx, point_color, point_radius);
    }
    ctx.fillStyle = point_color;
    for (const p of this.points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  /**
   * Find the closest point to a given point.
   * 
   * Procedure:
   *  1. Starting from the leaf node that contains the given point, working towards the root node. 
   *  2. For each node, go through all children and find the closest point.
   * 
   * To optimize, we can stop searching a node if the closest possible point in that node is further than the closest point found so far and
   * we skip last searching node, since it's always one of the children of the current node. 
   * 
   * @param {number} x - x coordinate of the point
   * @param {number} y - y coordinate of the point
   */
  find_closest(x, y) {
    let p = new Point(x, y);
    let data = [Infinity, null];          // stores closest distance and point
    let node = this.get_containing_node(p); // start from the leaf node that contains the point
    let last_node = null;
    do {
      // Search all children of this node. Last_node is skipped since it's always one of the children of this node.
      node._find_closest_from_children(data, x, y, last_node);

      // Step up to parent node
      last_node = node;
      node = node.parent;
    } while (node !== null);
    return data[1];
  }

  /**
   * Check if this node can contain a point that is closer than the closest point found so far.
   */
  _can_contain_closer(x, y, data) {
    let [dist, point] = data;
    if (x + dist > this.x || x - dist < this.x + this.w || y + dist > this.y || y - dist < this.y + this.h) {
      return true;
    }
    return false;
  }

  /**
   * Find the closest point from the children of this node.
   */
  _find_closest_from_children(data, x, y, last_node) {
    if (!this._can_contain_closer(x, y, data)) {
      return;
    }
    for (const c of this.children) {
      if (c === last_node) {
        continue;
      }
      c._find_closest_from_children(data, x, y, null);
    }

    for (const p of this.points) {
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < data[0]) {
        data[0] = d;
        data[1] = p;
      }
    }
  }

  /**
   * Remove a point from the tree
   * 
   * @param {Point} p - the point to remove
   */
  remove(point) {
    let node = this.get_containing_node(new Point(point.x, point.y));   // get the node that contains the point
    node.points = node.points.filter(p => p.x !== point.x && p.y !== point.y);  // remove the point from the node
    node.merge_parent();  // merge parent nodes if necessary
  }

  /**
   * Merge nodes if the total number of points in the subtree is less than SPLIT_THRESHOLD
   * 
   * Starting from leaf node, count the number of points in the subtree.
   * If the total number of points is less than SPLIT_THRESHOLD, merge all children into the parent node.
   * Repeat until the root node is reached or the total number of points is greater than SPLIT_THRESHOLD.
   */
  merge_parent() {
    let node = this.parent;
    let last_node = this;
    let count = this.points.length;

    while (node !== null) {
      for (let c of node.children) {
        if (c === last_node) {
          continue;
        }
        count += c.count_points();
      }

      if (count > QuadNode.SPLIT_THRESHOLD) {
        break;
      }
      for (let c of node.children) {
        node.points.push(...c.points);
        c.points = [];
      }
      node.children = [];
      last_node = node;
      node = node.parent;
    }
  }

  /**
   * Count the number of points in the subtree
   */
  count_points() {
    if (this.has_children()) {
      return this.children.reduce((acc, c) => acc + c.count_points(), 0);
    } else {
      return this.points.length;
    }
  }
}